import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import NotHopingToGetWorkValues from '../../../enums/notHopingToGetWorkValues'

export default class NotHopingToGetWorkController {
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
        page: 'notHopingToGetWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        notHopingToGetWork: record.notHopingToGetWork || [],
        notHopingToGetWorkDetails: record.notHopingToGetWorkDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['notHopingToGetWork', id, 'data'], data)

      res.render('pages/createPlan/notHopingToGetWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { notHopingToGetWork = [], notHopingToGetWorkDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['notHopingToGetWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/notHopingToGetWork/index', {
          ...data,
          errors,
          notHopingToGetWork,
          notHopingToGetWorkDetails,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id], {})
      setSessionData(req, ['createPlan', id], {
        ...record,
        notHopingToGetWork,
        notHopingToGetWorkDetails: notHopingToGetWork.includes(NotHopingToGetWorkValues.OTHER)
          ? notHopingToGetWorkDetails
          : '',
      })

      deleteSessionData(req, ['notHopingToGetWork', id, 'data'])

      // Redirect to the correct page based on value
      res.redirect(addressLookup.createPlan.qualifications(id, 'new'))
    } catch (err) {
      next(err)
    }
  }
}
