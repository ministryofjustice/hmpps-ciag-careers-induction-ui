/* eslint-disable no-nested-ternary */
import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getBackLocation from '../../../utils/getBackLocation'
import { InductionService } from '../../../services'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { getValueSafely } from '../../../utils'
import { orderCheckboxValue, orderObjectValue } from '../../../utils/orderCiagPlanArrays'
import { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class WorkDetailsController {
  constructor(private readonly inductionService: InductionService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, typeOfWorkExperienceKey } = req.params
    const mode: Mode = req.params.mode as Mode
    const { prisoner, plan } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Get job details
      const workExperience = isUpdateMode(mode) ? plan.workExperience.workExperience : record.workExperience
      const job =
        (workExperience || []).find(
          (q: { typeOfWorkExperience: string }) => q.typeOfWorkExperience === typeOfWorkExperienceKey.toUpperCase(),
        ) || {}

      // Calculate last page
      const typeOfWorkExperience = isUpdateMode(mode)
        ? getValueSafely(plan, 'workExperience.typeOfWorkExperience', [])
        : getValueSafely(record, 'typeOfWorkExperience', [])
      const position = typeOfWorkExperience.indexOf(typeOfWorkExperienceKey.toUpperCase())
      const lastKey = position > 0 ? typeOfWorkExperience[position - 1] : ''

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: isCreateMode(mode)
          ? lastKey
            ? addressLookup.createPlan.workDetails(id, lastKey, mode)
            : addressLookup.createPlan.typeOfWorkExperience(id, mode)
          : getHubPageByMode(mode, id),
        page: 'workDetails',
        uid: `${id}-${typeOfWorkExperienceKey}`,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWorkExperienceKey: typeOfWorkExperienceKey.toUpperCase(),
        jobRole: job.role,
        jobDetails: job.details,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['workDetails', id, 'data'], data)

      res.render('pages/createPlan/workDetails/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, typeOfWorkExperienceKey } = req.params
    const mode: Mode = req.params.mode as Mode
    const { from } = req.query
    const { jobRole, jobDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['workDetails', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/workDetails/index', {
          ...data,
          errors,
          jobRole,
          jobDetails,
        })
        return
      }

      deleteSessionData(req, ['workDetails', id, 'data'])

      // Handle update
      if (isUpdateMode(mode)) {
        this.handleUpdate(req, res)
        return
      }

      // Calculate next page
      const record = getSessionData(req, ['createPlan', id])
      const position = orderCheckboxValue(record.typeOfWorkExperience).indexOf(typeOfWorkExperienceKey.toUpperCase())
      const nextKey =
        position < record.typeOfWorkExperience.length
          ? orderCheckboxValue(record.typeOfWorkExperience)[position + 1]
          : ''

      const newValue = [
        ...(record.workExperience || []).filter(
          (q: { typeOfWorkExperience: string }) => q.typeOfWorkExperience !== typeOfWorkExperienceKey.toUpperCase(),
        ),
        {
          typeOfWorkExperience: typeOfWorkExperienceKey.toUpperCase(),
          role: jobRole,
          details: jobDetails,
          otherWork:
            typeOfWorkExperienceKey.toUpperCase() === TypeOfWorkExperienceValue.OTHER
              ? record.typeOfWorkExperienceOther
              : '',
        },
      ]

      // Update record in session
      setSessionData(req, ['createPlan', id], {
        ...record,
        workExperience: orderObjectValue(newValue, 'typeOfWorkExperience'),
      })

      // Handle edit
      if (isEditMode(mode) && (!nextKey || from)) {
        res.redirect(from ? data.backLocation : addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Default flow
      res.redirect(
        nextKey
          ? addressLookup.createPlan.workDetails(id, nextKey as TypeOfWorkExperienceValue, mode)
          : addressLookup.createPlan.workInterests(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id, typeOfWorkExperienceKey } = req.params
    const { plan, prisoner } = req.context
    const { jobRole, jobDetails } = req.body

    const position = plan.workExperience.typeOfWorkExperience.indexOf(typeOfWorkExperienceKey.toUpperCase())
    const nextKey =
      position < plan.workExperience.typeOfWorkExperience.length
        ? plan.workExperience.typeOfWorkExperience[position + 1]
        : ''

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      workExperience: {
        ...plan.workExperience,
        workExperience: [
          ...(plan.workExperience.workExperience || []).filter(
            (w: { typeOfWorkExperience: string }) => w.typeOfWorkExperience !== typeOfWorkExperienceKey.toUpperCase(),
          ),
          {
            typeOfWorkExperience: typeOfWorkExperienceKey.toUpperCase(),
            role: jobRole,
            details: jobDetails,
            otherWork:
              typeOfWorkExperienceKey.toUpperCase() === TypeOfWorkExperienceValue.OTHER
                ? plan.workExperience.typeOfWorkExperienceOther
                : '',
          },
        ],
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      },
    }

    // Call api
    const updateCiagPlanRequest = new UpdateCiagPlanRequest(updatedPlan)
    const dto = toCreateOrUpdateInductionDto(updateCiagPlanRequest)
    await this.inductionService.updateInduction(id, dto, res.locals.user.token)

    res.redirect(
      nextKey
        ? `${addressLookup.createPlan.workDetails(id, nextKey, 'update')}?from=${encryptUrlParameter(req.originalUrl)}`
        : addressLookup.learningPlan.profile(id),
    )
  }
}
