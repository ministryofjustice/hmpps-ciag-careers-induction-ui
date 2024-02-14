/* eslint-disable no-nested-ternary */
import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import CiagService from '../../../services/ciagService'
import InductionService from '../../../services/inductionService'
import { getValueSafely } from '../../../utils'
import { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import config from '../../../config'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class ParticularJobInterestsController {
  constructor(
    private readonly ciagService: CiagService,
    private readonly inductionService: InductionService,
  ) {}

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
        ? addressLookup.createPlan.workInterests(id, mode)
        : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Build field value
      const particularJobInterests = isUpdateMode(mode)
        ? getValueSafely(plan, 'workExperience.workInterests.particularJobInterests')
        : record.particularJobInterests

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
        particularJobInterests: (particularJobInterests || []).reduce(
          (acc: { [x: string]: string }, curr: { workInterest: string; role: string }) => {
            acc[curr.workInterest] = curr.role
            return acc
          },
          {},
        ),
      }

      // Store page data for use if validation fails
      setSessionData(req, ['particularJobInterests', id, 'data'], data)

      res.render('pages/createPlan/particularJobInterests/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['particularJobInterests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/particularJobInterests/index', {
          ...data,
          errors,
          particularJobInterests: { ...req.body },
        })
        return
      }

      deleteSessionData(req, ['particularJobInterests', id, 'data'])

      // Handle update
      if (isUpdateMode(mode)) {
        this.handleUpdate(req, res)
        return
      }

      // Get dynamic form values
      const values = Object.keys(req.body).filter(v => v !== '_csrf' && v !== 'particularJobInterests')

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])

      // Get keys of entered job details
      setSessionData(req, ['createPlan', id], {
        ...record,
        particularJobInterests: values.map(v => ({ workInterest: v, role: req.body[v] || '' })),
      })

      // Handle edit
      if (isEditMode(mode)) {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.skills(id))
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan, prisoner } = req.context

    // Get dynamic form values
    const values = Object.keys(req.body).filter(v => v !== '_csrf' && v !== 'particularJobInterests')

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      workExperience: {
        ...plan.workExperience,
        workInterests: {
          ...plan.workExperience.workInterests,
          particularJobInterests: values.map(v => ({ workInterest: v, role: req.body[v] || '' })),
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
        },
      },
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
