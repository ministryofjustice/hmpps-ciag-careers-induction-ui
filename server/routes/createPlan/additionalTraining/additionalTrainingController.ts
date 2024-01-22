import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import CiagService from '../../../services/ciagService'
import { getValueSafely } from '../../../utils'
import { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'

export default class AdditionalTrainingController {
  constructor(private readonly ciagService: CiagService) {}

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
      const backLocation = getBackLocation({
        req,
        defaultRoute: isCreateMode(mode)
          ? addressLookup.createPlan.qualifications(id, mode)
          : getHubPageByMode(mode, id, 'education-and-training'),
        page: 'additionalTraining',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        additionalTraining: isUpdateMode(mode)
          ? getValueSafely(plan, 'qualificationsAndTraining.additionalTraining', [])
          : getValueSafely(record, 'additionalTraining', []),
        additionalTrainingOther: isUpdateMode(mode)
          ? getValueSafely(plan, 'qualificationsAndTraining.additionalTrainingOther')
          : record.additionalTrainingOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['additionalTraining', id, 'data'], data)

      res.render('pages/createPlan/additionalTraining/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { additionalTraining = [], additionalTrainingOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['additionalTraining', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/additionalTraining/index', {
          ...data,
          errors,
          additionalTraining,
          additionalTrainingOther,
        })
        return
      }

      deleteSessionData(req, ['additionalTraining', id, 'data'])

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
        additionalTraining,
        additionalTrainingOther: additionalTraining.includes(AdditionalTrainingValue.OTHER)
          ? additionalTrainingOther
          : '',
      })

      // Handle edit
      if (isEditMode(mode)) {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(
        record.hopingToGetWork === HopingToGetWorkValue.YES
          ? addressLookup.createPlan.hasWorkedBefore(id, mode)
          : addressLookup.createPlan.inPrisonWork(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { additionalTraining = [], additionalTrainingOther } = req.body
    const { plan, prisoner } = req.context

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      qualificationsAndTraining: {
        ...plan.qualificationsAndTraining,
        additionalTraining,
        additionalTrainingOther: additionalTraining.includes(AdditionalTrainingValue.OTHER)
          ? additionalTrainingOther
          : '',
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      },
    }

    // Call api
    await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

    res.redirect(addressLookup.learningPlan.profile(id, 'education-and-training'))
  }
}
