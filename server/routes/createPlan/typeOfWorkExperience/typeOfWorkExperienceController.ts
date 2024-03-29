import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import { InductionService } from '../../../services'
import { getValueSafely } from '../../../utils'
import { orderCheckboxValue } from '../../../utils/orderCiagPlanArrays'
import { isCreateMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class TypeOfWorkExperienceController {
  constructor(private readonly inductionService: InductionService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { prisoner, plan } = req.context

    try {
      // If no record or plan
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation = isCreateMode(mode)
        ? addressLookup.createPlan.hasWorkedBefore(id, mode)
        : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWorkExperience: isUpdateMode(mode)
          ? getValueSafely(plan, 'workExperience.typeOfWorkExperience', [])
          : getValueSafely(record, 'typeOfWorkExperience', []),
        typeOfWorkExperienceOther: isUpdateMode(mode)
          ? getValueSafely(plan, 'workExperience.typeOfWorkExperienceOther')
          : record.typeOfWorkExperienceOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['typeOfWorkExperience', id, 'data'], data)

      res.render('pages/createPlan/typeOfWorkExperience/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { typeOfWorkExperience = [], typeOfWorkExperienceOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['typeOfWorkExperience', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/typeOfWorkExperience/index', {
          ...data,
          errors,
          typeOfWorkExperience,
          typeOfWorkExperienceOther,
        })
        return
      }

      deleteSessionData(req, ['typeOfWorkExperience', id, 'data'])

      // Handle update
      if (isUpdateMode(mode)) {
        this.handleUpdate(req, res)
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        typeOfWorkExperience: orderCheckboxValue(typeOfWorkExperience),
        typeOfWorkExperienceOther: typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER)
          ? typeOfWorkExperienceOther
          : '',
        workExperience: (record.workExperience || []).filter((j: { typeOfWorkExperience: string }) =>
          typeOfWorkExperience.includes(j.typeOfWorkExperience),
        ),
      })

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(
        addressLookup.createPlan.workDetails(
          id,
          orderCheckboxValue(typeOfWorkExperience)[0] as TypeOfWorkExperienceValue,
          mode,
        ),
      )
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan, prisoner } = req.context
    const { typeOfWorkExperience = [], typeOfWorkExperienceOther } = req.body

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      workExperience: {
        ...plan.workExperience,
        typeOfWorkExperience,
        typeOfWorkExperienceOther: typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER)
          ? typeOfWorkExperienceOther
          : '',
        workExperience: (plan.workExperience.workExperience || []).filter((j: { typeOfWorkExperience: string }) =>
          typeOfWorkExperience.includes(j.typeOfWorkExperience),
        ),
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      },
    }

    // Call api
    const updateCiagPlanRequest = new UpdateCiagPlanRequest(updatedPlan)
    const dto = toCreateOrUpdateInductionDto(updateCiagPlanRequest)
    await this.inductionService.updateInduction(id, dto, res.locals.user.token)

    res.redirect(
      addressLookup.createPlan.workDetails(
        id,
        orderCheckboxValue(typeOfWorkExperience)[0] as TypeOfWorkExperienceValue,
        'update',
      ),
    )
  }
}
