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
import CiagService from '../../../services/ciagService'
import InductionService from '../../../services/inductionService'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import { isUpdateMode, Mode } from '../../routeModes'
import config from '../../../config'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class QualificationDetailsController {
  constructor(
    private readonly ciagService: CiagService,
    private readonly inductionService: InductionService,
  ) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, qualificationId } = req.params
    const mode: Mode = req.params.mode as Mode
    const { prisoner, plan } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // If no qualification goto education level to start again
      const qualification = (record.qualifications || []).find((q: { id: string }) => q.id === qualificationId)
      if (!qualification) {
        res.redirect(addressLookup.createPlan.educationLevel(id))
        return
      }

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: addressLookup.createPlan.qualificationLevel(id, qualificationId, mode),
        page: 'qualificationDetails',
        uid: `${id}_${qualificationId}`,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        educationLevel: record.educationLevel,
        qualificationLevel: qualification.level,
        qualificationSubject: qualification.subject,
        qualificationGrade: qualification.grade,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['qualificationDetails', id, 'data'], data)

      res.render('pages/createPlan/qualificationDetails/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, qualificationId } = req.params
    const mode: Mode = req.params.mode as Mode
    const { qualificationSubject, qualificationGrade } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['qualificationDetails', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/qualificationDetails/index', {
          ...data,
          errors,
          qualificationSubject,
          qualificationGrade,
        })
        return
      }

      deleteSessionData(req, ['qualificationDetails', id, 'data'])

      // Handle update
      if (isUpdateMode(mode)) {
        this.handleUpdate(req, res)
        return
      }

      // Update record in session
      const record = getSessionData(req, ['createPlan', id])
      const qualification = record.qualifications.find((q: { id: string }) => q.id === qualificationId)

      setSessionData(req, ['createPlan', id], {
        ...record,
        qualifications: [
          ...record.qualifications.filter((q: { id: string }) => q.id !== qualificationId),
          {
            ...qualification,
            subject: qualificationSubject,
            grade: qualificationGrade,
          },
        ],
      })

      res.redirect(addressLookup.createPlan.qualifications(id, mode))
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id, qualificationId } = req.params
    const { plan, prisoner } = req.context
    const { qualificationSubject, qualificationGrade } = req.body

    // Update record in session
    const record = getSessionData(req, ['createPlan', id])
    const qualification = record.qualifications.find((q: { id: string }) => q.id === qualificationId)

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      qualificationsAndTraining: {
        ...plan.qualificationsAndTraining,
        qualifications: [
          ...(plan.qualificationsAndTraining.qualifications || []),
          {
            level: qualification.level,
            subject: qualificationSubject,
            grade: qualificationGrade,
          },
        ],
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
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

    res.redirect(addressLookup.createPlan.qualifications(id, 'update'))
  }
}
