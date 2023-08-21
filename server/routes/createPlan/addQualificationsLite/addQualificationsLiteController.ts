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

export default class AddQualificationsLiteController {
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

      // Setup back location
      const backLocation =
        mode !== 'edit'
          ? addressLookup.createPlan.reasonToNotGetWork(id)
          : addressLookup.createPlan.checkYourAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        learnerLatestAssessment: plainToClass(AssessmentViewModel, _.first(learnerLatestAssessment)),
        addQualificationsLite: record.addQualificationsLite,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['addQualificationsLite', id, 'data'], data)

      res.render('pages/createPlan/addQualificationsLite/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { addQualificationsLite } = req.body

    try {
      const record = getSessionData(req, ['createPlan', id])

      // Handle delete
      // If validation errors render errors
      const data = getSessionData(req, ['addQualificationsLite', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/addQualificationsLite/index', {
          ...data,
          errors,
          addQualificationsLite,
        })
        return
      }

      // Update record in session
      deleteSessionData(req, ['addQualificationsLite', id, 'data'])
      setSessionData(req, ['createPlan', id], {
        ...record,
        addQualificationsLite,
      })

      // Handle edit
      if (mode === 'edit') {
        if (addQualificationsLite !== record.addQualificationsLite && addQualificationsLite === YesNoValue.YES) {
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
        addQualificationsLite === YesNoValue.YES
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
