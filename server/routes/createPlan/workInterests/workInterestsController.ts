/* eslint-disable no-nested-ternary */
import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import { InductionService } from '../../../services'
import { getValueSafely } from '../../../utils'
import { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class WorkInterestsController {
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

      // Get last key
      const typeOfWorkExperience = isUpdateMode(mode)
        ? getValueSafely(plan, 'workExperience.typeOfWorkExperience', [])
        : getValueSafely(record, 'typeOfWorkExperience', [])
      const lastKey = typeOfWorkExperience ? typeOfWorkExperience.at(-1) : ''

      // Setup back location
      const backLocation = isCreateMode(mode)
        ? lastKey
          ? addressLookup.createPlan.workDetails(id, lastKey, mode)
          : addressLookup.createPlan.hasWorkedBefore(id, mode)
        : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        workInterests: isUpdateMode(mode)
          ? getValueSafely(plan, 'workExperience.workInterests.workInterests', [])
          : getValueSafely(record, 'workInterests', []),
        workInterestsOther: isUpdateMode(mode)
          ? getValueSafely(plan, 'workExperience.workInterests.workInterestsOther')
          : record.workInterestsOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['workInterests', id, 'data'], data)

      res.render('pages/createPlan/workInterests/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { workInterests = [], workInterestsOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['workInterests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/workInterests/index', {
          ...data,
          errors,
          workInterests,
          workInterestsOther,
        })
        return
      }

      deleteSessionData(req, ['workInterests', id, 'data'])

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
        workInterests,
        workInterestsOther: workInterests.includes(WorkInterestsValue.OTHER) ? workInterestsOther : '',
        particularJobInterests: getValueSafely(record, 'particularJobInterests', []).filter(
          (p: { workInterest: string }) => workInterests.includes(p.workInterest),
        ),
      })

      // Handle edit and update
      if (isEditMode(mode)) {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.particularJobInterests(id, mode))
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan, prisoner } = req.context
    const { workInterests = [], workInterestsOther } = req.body

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      workExperience: {
        ...plan.workExperience,
        workInterests: {
          ...plan.workExperience.workInterests,
          workInterests,
          workInterestsOther: workInterests.includes(WorkInterestsValue.OTHER) ? workInterestsOther : '',
          particularJobInterests: getValueSafely(
            plan,
            'workExperience.workInterests.particularJobInterests',
            [],
          ).filter((p: { workInterest: string }) => workInterests.includes(p.workInterest)),
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
        },
      },
    }

    // Call api
    const updateCiagPlanRequest = new UpdateCiagPlanRequest(updatedPlan)
    const dto = toCreateOrUpdateInductionDto(updateCiagPlanRequest)
    await this.inductionService.updateInduction(id, dto, res.locals.user.token)

    res.redirect(addressLookup.learningPlan.profile(id))
  }
}
