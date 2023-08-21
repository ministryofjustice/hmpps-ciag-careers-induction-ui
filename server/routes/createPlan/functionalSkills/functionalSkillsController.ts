import _ from 'lodash'
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import AssessmentViewModel from '../../../viewModels/assessmentViewModel'
import uuidv4 from '../../../utils/guid'
import YesNoValue from '../../../enums/yesNoValue'

export default class FunctionalSkillsController {
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

      // Clear blank functionalSkills, from back functionality
      record.functionalSkills = (record.functionalSkills || []).filter(
        (q: { level: string; subject: string; grade: string }) => q.level && q.subject && q.grade,
      )
      setSessionData(req, ['createPlan', id], record)

      // Setup back location
      const backLocation =
        mode !== 'edit' ? addressLookup.createPlan.hopingToGetWork(id) : addressLookup.createPlan.checkYourAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        educationLevel: record.educationLevel,
        functionalSkills: record.functionalSkills || [],
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        learnerLatestAssessment: plainToClass(AssessmentViewModel, _.first(learnerLatestAssessment)),
      }

      res.render('pages/createPlan/functionalSkills/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { addQualification, removeQualification } = req.body

    try {
      const record = getSessionData(req, ['createPlan', id])

      // Handle delete
      if (removeQualification) {
        setSessionData(req, ['createPlan', id], {
          ...record,
          functionalSkills: record.qualifications.filter((p: { id: string }) => p.id !== removeQualification),
        })
        res.redirect(addressLookup.createPlan.functionalSkills(id, mode))
        return
      }

      // If NO, redirect to otherQualifications
      if (addQualification === YesNoValue.NO) {
        res.redirect(addressLookup.createPlan.additionalTraining(id, mode))
        return
      }

      // Handle add functionalSkills
      if (Object.prototype.hasOwnProperty.call(req.body, 'addQualification')) {
        res.redirect(addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode))
        return
      }

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Default flow
      const nextPage =
        record.functionalSkills && record.functionalSkills.length
          ? addressLookup.createPlan.additionalTraining(id, mode)
          : addressLookup.createPlan.educationLevel(id, mode)
      res.redirect(nextPage)
    } catch (err) {
      next(err)
    }
  }
}
