import _ from 'lodash'
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import AssessmentViewModel from '../../../viewModels/assessmentViewModel'
import uuidv4 from '../../../utils/guid'

export default class QualificationsController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, learnerLatestAssessment } = req.context

    try {
      // If no record or incorrect value return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record || !record.hopingToGetWork) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Clear blank qualifications, from back functionality
      record.qualifications = (record.qualifications || []).filter(
        (q: { level: string; subject: string; grade: string }) => q.level && q.subject && q.grade,
      )
      setSessionData(req, ['createPlan', id], record)

      // Setup back location
      const backLocation =
        mode !== 'edit' ? addressLookup.createPlan.hopingToGetWork(id) : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        educationLevel: record.educationLevel,
        qualifications: record.qualifications || [],
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

    try {
      const record = getSessionData(req, ['createPlan', id])

      // Handle delete
      if (removeQualification) {
        setSessionData(req, ['createPlan', id], {
          ...record,
          qualifications: record.qualifications.filter((p: { id: string }) => p.id !== removeQualification),
        })
        res.redirect(addressLookup.createPlan.qualifications(id, mode))
        return
      }

      // Handle add qualifications
      if (Object.prototype.hasOwnProperty.call(req.body, 'addQualification')) {
        res.redirect(addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode))
        return
      }

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkAnswers(id))
        return
      }

      // Default flow
      const nextPage =
        record.qualifications && record.qualifications.length
          ? addressLookup.createPlan.otherQualifications(id, mode)
          : addressLookup.createPlan.educationLevel(id, mode)
      res.redirect(nextPage)
    } catch (err) {
      next(err)
    }
  }
}
