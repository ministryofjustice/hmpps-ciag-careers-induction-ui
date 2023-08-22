import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class AdditionalTrainingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // If no record or incorrect value return to hopeToGetWorkz
      const record = getSessionData(req, ['createPlan', id])
      if (!record || !record.hopingToGetWork) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new'
            ? addressLookup.createPlan.qualifications(id, mode)
            : addressLookup.createPlan.checkYourAnswers(id),
        page: 'additionalTraining',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        additionalTraining:
          mode === 'update' ? plan.qualificationsAndTraining.additionalTraining : record.additionalTraining || [],
        additionalTrainingOther:
          mode === 'update' ? plan.qualificationsAndTraining.additionalTrainingOther : record.additionalTrainingOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['additionalTraining', id, 'data'], data)

      res.render('pages/createPlan/additionalTraining/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { additionalTraining = [], additionalTrainingOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['additionalTraining', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/additionalTraining/index', {
          ...data,
          errors,
          additionalTraining,
          additionalTrainingOther,
        })
        return
      }

      deleteSessionData(req, ['additionalTraining', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        additionalTraining,
        additionalTrainingOther: additionalTraining.includes(AdditionalTrainingValue.OTHER)
          ? additionalTrainingOther
          : '',
      })

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(
        record.hopingToGetWork === HopingToGetWorkValue.YES
          ? addressLookup.createPlan.hasWorkedBefore(id, mode)
          : addressLookup.createPlan.inPrisonWork(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }
}
