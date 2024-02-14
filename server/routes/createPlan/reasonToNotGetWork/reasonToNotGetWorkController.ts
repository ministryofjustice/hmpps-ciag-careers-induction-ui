import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'
import { CiagService, InductionService } from '../../../services'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import { getValueSafely } from '../../../utils'
import { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import config from '../../../config'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class ReasonToNotGetWorkController {
  constructor(
    private readonly ciagService: CiagService,
    private readonly inductionService: InductionService,
  ) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { prisoner, plan } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createPlan', id], {})

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: isCreateMode(mode) ? addressLookup.createPlan.hopingToGetWork(id) : getHubPageByMode(mode, id),
        page: 'reasonToNotGetWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        reasonToNotGetWork: isUpdateMode(mode)
          ? getValueSafely(plan, 'reasonToNotGetWork', [])
          : getValueSafely(record, 'reasonToNotGetWork', []),
        reasonToNotGetWorkOther: isUpdateMode(mode) ? plan.reasonToNotGetWorkOther : record.reasonToNotGetWorkOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['reasonToNotGetWork', id, 'data'], data)

      res.render('pages/createPlan/reasonToNotGetWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { reasonToNotGetWork = [], reasonToNotGetWorkOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['reasonToNotGetWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/reasonToNotGetWork/index', {
          ...data,
          errors,
          reasonToNotGetWork,
          reasonToNotGetWorkOther,
        })
        return
      }

      deleteSessionData(req, ['reasonToNotGetWork', id, 'data'])

      // Handle update
      if (isUpdateMode(mode)) {
        this.handleUpdate(req, res)
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id], {})
      setSessionData(req, ['createPlan', id], {
        ...record,
        reasonToNotGetWork,
        reasonToNotGetWorkOther: reasonToNotGetWork.includes(ReasonToNotGetWorkValue.OTHER)
          ? reasonToNotGetWorkOther
          : '',
      })

      // Handle edit
      if (isEditMode(mode)) {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on if there are existing qualifications
      res.redirect(
        record.qualifications?.length
          ? addressLookup.createPlan.qualifications(id, mode)
          : addressLookup.createPlan.wantsToAddQualifications(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan, prisoner } = req.context
    const { reasonToNotGetWork = [], reasonToNotGetWorkOther } = req.body

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      reasonToNotGetWork,
      reasonToNotGetWorkOther: reasonToNotGetWork.includes(ReasonToNotGetWorkValue.OTHER)
        ? reasonToNotGetWorkOther
        : '',
      modifiedBy: res.locals.user.username,
      modifiedDateTime: new Date().toISOString(),
    }

    // Call api
    const updateCiagPlanRequest = new UpdateCiagPlanRequest(updatedPlan)
    if (config.featureToggles.useNewInductionApiEnabled) {
      const dto = toCreateOrUpdateInductionDto(updateCiagPlanRequest)
      await this.inductionService.updateInduction(id, dto, res.locals.user.token)
    } else {
      await this.ciagService.updateCiagPlan(res.locals.user.token, id, updateCiagPlanRequest)
    }

    res.redirect(addressLookup.learningPlan.profile(id))
  }
}
