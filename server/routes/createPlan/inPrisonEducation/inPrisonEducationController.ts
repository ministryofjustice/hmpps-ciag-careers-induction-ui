import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import InPrisonEducationValue from '../../../enums/inPrisonEducationValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class InPrisonEducationController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to hopeToGetWork
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
        inPrisonEducation: record.inPrisonEducation || [],
        inPrisonEducationDetails: record.inPrisonEducationDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['inPrisonEducation', id, 'data'], data)

      res.render('pages/createPlan/inPrisonEducation/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { inPrisonEducation = [], inPrisonEducationDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['inPrisonEducation', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/inPrisonEducation/index', {
          ...data,
          errors,
          inPrisonEducation,
          inPrisonEducationDetails,
        })
        return
      }

      deleteSessionData(req, ['inPrisonEducation', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        inPrisonEducation,
        inPrisonEducationDetails: inPrisonEducation.includes(InPrisonEducationValue.OTHER)
          ? inPrisonEducationDetails
          : '',
      })

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.inPrisonEducation(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
