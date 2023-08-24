import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'

export default class HopingToGetWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createPlan', id], {})

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: mode === 'new' ? addressLookup.workPlan(id) : getHubPageByMode(mode, id),
        page: 'hopingToGetWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        hopingToGetWork: mode === 'update' ? plan.hopingToGetWork : record.hopingToGetWork,
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

      // Handle no changes
      if (mode !== 'new' && hopingToGetWork === record.hopingToGetWork) {
        res.redirect(getHubPageByMode(mode, id))
        return
      }

      // Handle update with full flow change
      if (mode === 'update') {
        setSessionData(req, ['isUpdateFlow', id], true)
      }

      // Create new record in sessionData
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork,
      })

      // Redirect to the correct page based on value
      res.redirect(
        hopingToGetWork === HopingToGetWorkValue.YES
          ? addressLookup.createPlan.qualifications(id, 'new')
          : addressLookup.createPlan.reasonToNotGetWork(id, 'new'),
      )
    } catch (err) {
      next(err)
    }
  }
}
