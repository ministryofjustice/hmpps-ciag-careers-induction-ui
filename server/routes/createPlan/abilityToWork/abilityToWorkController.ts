import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class AbilityToWorkController {
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
        mode === 'new' ? addressLookup.createPlan.interests(id, mode) : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        abilityToWork: record.abilityToWork || [],
        abilityToWorkDetails: record.abilityToWorkDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['abilityToWork', id, 'data'], data)

      res.render('pages/createPlan/abilityToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { abilityToWork = [], abilityToWorkDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['abilityToWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/abilityToWork/index', {
          ...data,
          errors,
          abilityToWork,
          abilityToWorkDetails,
        })
        return
      }

      deleteSessionData(req, ['abilityToWork', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        abilityToWork,
        abilityToWorkDetails: abilityToWork.includes(AbilityToWorkValue.OTHER) ? abilityToWorkDetails : '',
      })

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.checkAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}