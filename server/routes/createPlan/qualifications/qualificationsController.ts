import _ from 'lodash'
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import AssessmentViewModel from '../../../viewModels/assessmentViewModel'
import uuidv4 from '../../../utils/guid'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import CiagService from '../../../services/ciagService'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'

export default class QualificationsController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
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
      const backLocation = mode === 'new' ? addressLookup.createPlan.hopingToGetWork(id) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        educationLevel:
          mode === 'update' ? _.get(plan, 'qualificationsAndTraining.educationLevel') : record.educationLevel,
        qualifications:
          mode === 'update'
            ? _.get(plan, 'qualificationsAndTraining.qualifications', [])
            : _.get(record, 'qualifications', []),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        learnerLatestAssessment: plainToClass(AssessmentViewModel, _.first(learnerLatestAssessment)),
      }

      res.render('pages/createPlan/qualifications/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { removeQualification } = req.body
    const { plan } = req.context

    try {
      let record = getSessionData(req, ['createPlan', id])

      // Handle delete
      if (removeQualification) {
        if (mode === 'update') {
          // Update data model
          const updatedPlan = {
            ...plan,
            qualificationsAndTraining: {
              ...plan.qualificationsAndTraining,
              qualifications: plan.qualificationsAndTraining.qualifications.filter(
                (p: { id: string }) => p.id !== removeQualification,
              ),
            },
          }

          // Call api
          await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))
        } else {
          // Update record in session
          setSessionData(req, ['createPlan', id], {
            ...record,
            qualifications: record.qualifications.filter((p: { id: string }) => p.id !== removeQualification),
          })
        }
        res.redirect(addressLookup.createPlan.qualifications(id, mode))
        return
      }

      // Handle add qualifications
      if (Object.prototype.hasOwnProperty.call(req.body, 'addQualification')) {
        if (mode === 'update') {
          // Setup temporary record for multi page add qualification flow
          record = {
            qualifications: _.get(plan, 'qualificationsAndTraining.qualifications', []),
          }
          setSessionData(req, ['createPlan', id], record)
        }

        res.redirect(addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode))
        return
      }

      // Handle continue
      if (mode === 'update') {
        // Redirect to profile if qualifications aleady added
        if (record.qualifications && record.qualifications.length) {
          setSessionData(req, ['redirect', id], addressLookup.learningPlan.profile(id))

          res.redirect(addressLookup.redirect(id))
          return
        }

        res.redirect(addressLookup.createPlan.educationLevel(id, mode))
        return
      }

      // Handle edit and update
      if (mode === 'edit') {
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
}
