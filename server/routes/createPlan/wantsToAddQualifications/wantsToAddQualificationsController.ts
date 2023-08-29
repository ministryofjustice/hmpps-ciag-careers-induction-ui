import _ from 'lodash'
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import AssessmentViewModel from '../../../viewModels/assessmentViewModel'
import YesNoValue from '../../../enums/yesNoValue'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'
import uuidv4 from '../../../utils/guid'
import getHubPageByMode from '../../../utils/getHubPageByMode'

export default class WantsToAddQualificationsController {
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

      // Setup back location
      const backLocation = mode === 'new' ? addressLookup.createPlan.reasonToNotGetWork(id) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        learnerLatestAssessment: plainToClass(AssessmentViewModel, _.first(learnerLatestAssessment)),
        wantsToAddQualifications: record.wantsToAddQualifications,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['wantsToAddQualifications', id, 'data'], data)

      res.render('pages/createPlan/wantsToAddQualifications/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { wantsToAddQualifications } = req.body

    try {
      const record = getSessionData(req, ['createPlan', id])

      // Handle delete
      // If validation errors render errors
      const data = getSessionData(req, ['wantsToAddQualifications', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/wantsToAddQualifications/index', {
          ...data,
          errors,
          wantsToAddQualifications,
        })
        return
      }

      // Update record in session
      deleteSessionData(req, ['wantsToAddQualifications', id, 'data'])
      setSessionData(req, ['createPlan', id], {
        ...record,
        wantsToAddQualifications,
      })

      // Handle edit
      if (mode === 'edit') {
        if (
          wantsToAddQualifications !== record.wantsToAddQualifications &&
          wantsToAddQualifications === YesNoValue.YES
        ) {
          res.redirect(
            `${addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode)}?from=${encryptUrlParameter(
              req.originalUrl,
            )}`,
          )
          return
        }

        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Default flow
      res.redirect(
        wantsToAddQualifications === YesNoValue.YES
          ? `${addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode)}?from=${encryptUrlParameter(
              req.originalUrl,
            )}`
          : `${addressLookup.createPlan.additionalTraining(id, mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
    } catch (err) {
      next(err)
    }
  }
}
