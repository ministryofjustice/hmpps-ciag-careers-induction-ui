import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TypeOfWorkValue from '../../../enums/typeOfWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class TypeOfWorkController {
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
      const backLocation =
        mode === 'new'
          ? addressLookup.createPlan.otherQualifications(id, mode)
          : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWork:
          mode === 'update'
            ? plan.planData.supportAccepted.workExperience.qualificationsAndTraining
            : record.typeOfWork || [],
        typeOfWorkDetails:
          mode === 'update'
            ? plan.planData.supportAccepted.workExperience.qualificationsAndTrainingOther
            : record.typeOfWorkDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['typeOfWork', id, 'data'], data)

      res.render('pages/createPlan/typeOfWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { typeOfWork = [], typeOfWorkDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['typeOfWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/typeOfWork/index', {
          ...data,
          errors,
          typeOfWork,
          typeOfWorkDetails,
        })
        return
      }

      deleteSessionData(req, ['typeOfWork', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        typeOfWork,
        typeOfWorkDetails: typeOfWork.includes(TypeOfWorkValue.OTHER) ? typeOfWorkDetails : '',
      })

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.workDetails(id, typeOfWork[0], mode))
    } catch (err) {
      next(err)
    }
  }
}
