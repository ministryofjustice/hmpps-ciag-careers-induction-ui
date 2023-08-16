import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import ReasonToNotGetWorkValues from '../../../enums/reasonToNotGetWorkValues'

export default class ReasonToNotGetWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createPlan', id], {})

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: addressLookup.createPlan.hopingToGetWork(id),
        page: 'reasonToNotGetWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        reasonToNotGetWork: record.reasonToNotGetWork || [],
        reasonToNotGetWorkDetails: record.reasonToNotGetWorkDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['reasonToNotGetWork', id, 'data'], data)

      res.render('pages/createPlan/reasonToNotGetWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { reasonToNotGetWork = [], reasonToNotGetWorkDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['reasonToNotGetWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/reasonToNotGetWork/index', {
          ...data,
          errors,
          reasonToNotGetWork,
          reasonToNotGetWorkDetails,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id], {})
      setSessionData(req, ['createPlan', id], {
        ...record,
        reasonToNotGetWork,
        reasonToNotGetWorkDetails: reasonToNotGetWork.includes(ReasonToNotGetWorkValues.OTHER)
          ? reasonToNotGetWorkDetails
          : '',
      })

      deleteSessionData(req, ['reasonToNotGetWork', id, 'data'])

      // Redirect to the correct page based on value
      res.redirect(addressLookup.createPlan.qualifications(id, 'new'))
    } catch (err) {
      next(err)
    }
  }
}
