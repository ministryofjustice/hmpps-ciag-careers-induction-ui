import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import InterestsValue from '../../../enums/interestsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class InterestsController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to hopeToGetWorkz
      const record = getSessionData(req, ['createPlan', id])
      if (!record || !record.hopingToGetWork) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation =
        mode === 'new' ? addressLookup.createPlan.skills(id, mode) : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        interests: record.interests || [],
        interestsDetails: record.interestsDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['interests', id, 'data'], data)

      res.render('pages/createPlan/interests/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { interests = [], interestsDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['interests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/interests/index', {
          ...data,
          errors,
          interests,
          interestsDetails,
        })
        return
      }

      deleteSessionData(req, ['interests', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        interests,
        interestsDetails: interests.includes(InterestsValue.OTHER) ? interestsDetails : '',
      })

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.abilityToWork(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
