/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import AssessmentViewModel from '../../../viewModels/assessmentViewModel'
import uuidv4 from '../../../utils/guid'
import { InductionService } from '../../../services'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import getBackLocation from '../../../utils/getBackLocation'
import { getValueSafely } from '../../../utils'
import { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class QualificationsController {
  constructor(private readonly inductionService: InductionService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { prisoner, learnerLatestAssessment, plan } = req.context

    try {
      // If no record or incorrect value return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Clear blank qualifications, from back functionality
      if (mode !== 'update') {
        record.qualifications = (record.qualifications || []).filter(
          (q: { level: string; subject: string; grade: string }) => q.level && q.subject && q.grade,
        )
        setSessionData(req, ['createPlan', id], record)
      }

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: isCreateMode(mode)
          ? addressLookup.createPlan.hopingToGetWork(id)
          : getHubPageByMode(mode, id, 'education-and-training'),
        page: 'qualifications',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        educationLevel: isUpdateMode(mode)
          ? getValueSafely(plan, 'qualificationsAndTraining.educationLevel')
          : record.educationLevel,
        qualifications: isUpdateMode(mode)
          ? getValueSafely(plan, 'qualificationsAndTraining.qualifications', [])
          : getValueSafely(record, 'qualifications', []),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        learnerLatestAssessment: plainToClass(AssessmentViewModel, _.first(learnerLatestAssessment)),
      }

      res.render('pages/createPlan/qualifications/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { removeQualification } = req.body

    try {
      // Handle update
      if (isUpdateMode(mode)) {
        this.handleUpdate(req, res)
        return
      }

      const record = getSessionData(req, ['createPlan', id])

      // Handle delete
      if (removeQualification) {
        // Update record in session
        setSessionData(req, ['createPlan', id], {
          ...record,
          qualifications: record.qualifications.filter(
            (item: { level: any; subject: any; grade: any }) =>
              removeQualification !== `${item.level}-${item.subject}-${item.grade}`,
          ),
        })

        res.redirect(addressLookup.createPlan.qualifications(id, mode))
        return
      }

      // Handle add qualifications
      if (Object.prototype.hasOwnProperty.call(req.body, 'addQualification')) {
        res.redirect(addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode))
        return
      }

      // Handle edit and update
      if (isEditMode(mode)) {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Default flow
      const nextPage =
        record.qualifications && record.qualifications.length
          ? addressLookup.createPlan.additionalTraining(id, mode)
          : addressLookup.createPlan.educationLevel(id, mode)
      res.redirect(nextPage)
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan, prisoner } = req.context
    const { removeQualification } = req.body

    const existingQualifications = getValueSafely(plan, 'qualificationsAndTraining.qualifications', [])

    // Handle remove qualification
    if (removeQualification) {
      // Update data model
      const updatedPlan = {
        prisonId: prisoner.prisonId,
        ...plan,
        qualificationsAndTraining: {
          ...plan.qualificationsAndTraining,
          qualifications: existingQualifications.filter(
            (item: { level: any; subject: any; grade: any }) =>
              removeQualification !== `${item.level}-${item.subject}-${item.grade}`,
          ),
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
        },
      }

      // Call api
      const updateCiagPlanRequest = new UpdateCiagPlanRequest(updatedPlan)
      const dto = toCreateOrUpdateInductionDto(updateCiagPlanRequest)
      await this.inductionService.updateInduction(id, dto, res.locals.user.token)

      res.redirect(addressLookup.createPlan.qualifications(id, 'update'))
      return
    }

    // Handle add qualification
    if (Object.prototype.hasOwnProperty.call(req.body, 'addQualification')) {
      // Setup temporary record for multi page add qualification flow
      setSessionData(req, ['createPlan', id], {
        qualifications: existingQualifications,
      })

      res.redirect(addressLookup.createPlan.qualificationLevel(id, uuidv4(), 'update'))
      return
    }

    // Redirect to profile if qualifications aleady added
    if (existingQualifications.length) {
      deleteSessionData(req, ['createPlan', id])

      res.redirect(addressLookup.learningPlan.profile(id, 'education-and-training'))
      return
    }

    res.redirect(addressLookup.createPlan.educationLevel(id, 'update'))
  }
}
