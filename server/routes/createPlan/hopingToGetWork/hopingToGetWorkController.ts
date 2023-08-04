import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class HopingToGetWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createPlan', id], {})

      // Setup page data
      const data = {
        backLocation: addressLookup.workPlan(id),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        hopingToGetWork: record.hopingToGetWork,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['hopingToGetWork', id, 'data'], data)

      res.render('pages/createPlan/hopingToGetWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { hopingToGetWork } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['hopingToGetWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/hopingToGetWork/index', {
          ...data,
          errors,
        })
        return
      }

      const record = getSessionData(req, ['createPlan', id], {})
      deleteSessionData(req, ['hopingToGetWork', id, 'data'])

      // Handle edit, no changes
      if (mode === 'edit' && hopingToGetWork !== record.hopingToGetWork) {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Create new record in sessionData
      setSessionData(req, ['createPlan', id], {
        ...record,
        hopingToGetWork,
      })

      // Redirect to the correct page based on value
      res.redirect(
        hopingToGetWork === HopingToGetWorkValue.YES
          ? addressLookup.createPlan.qualifications(id, 'new')
          : addressLookup.createPlan.whyNoWork(id, 'new'),
      )
    } catch (err) {
      next(err)
    }
  }
}
