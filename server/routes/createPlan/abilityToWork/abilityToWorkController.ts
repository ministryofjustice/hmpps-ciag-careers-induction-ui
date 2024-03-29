import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import { getValueSafely } from '../../../utils'
import { isCreateMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import { InductionService } from '../../../services'

export default class AbilityToWorkController {
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
        ? addressLookup.createPlan.personalInterests(id, mode)
        : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        abilityToWork: isUpdateMode(mode)
          ? getValueSafely(plan, 'abilityToWork', [])
          : getValueSafely(record, 'abilityToWork', []),
        abilityToWorkOther: isUpdateMode(mode) ? plan.abilityToWorkOther : record.abilityToWorkOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['abilityToWork', id, 'data'], data)

      res.render('pages/createPlan/abilityToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { abilityToWork = [], abilityToWorkOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['abilityToWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/abilityToWork/index', {
          ...data,
          errors,
          abilityToWork,
          abilityToWorkOther,
        })
        return
      }

      deleteSessionData(req, ['abilityToWork', id, 'data'])

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
        abilityToWork,
        abilityToWorkOther: abilityToWork.includes(AbilityToWorkValue.OTHER) ? abilityToWorkOther : '',
      })

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.checkYourAnswers(id))
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { abilityToWork = [], abilityToWorkOther } = req.body
    const { plan, prisoner } = req.context

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      abilityToWork,
      abilityToWorkOther: abilityToWork.includes(AbilityToWorkValue.OTHER) ? abilityToWorkOther : '',
      modifiedBy: res.locals.user.username,
      modifiedDateTime: new Date().toISOString(),
    }

    // Call api
    const updateCiagPlanRequest = new UpdateCiagPlanRequest(updatedPlan)
    const dto = toCreateOrUpdateInductionDto(updateCiagPlanRequest)
    await this.inductionService.updateInduction(id, dto, res.locals.user.token)

    res.redirect(addressLookup.learningPlan.profile(id))
  }
}
