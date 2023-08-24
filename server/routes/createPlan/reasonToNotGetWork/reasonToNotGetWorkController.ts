import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'

export default class ReasonToNotGetWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createPlan', id], {})

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new' ? addressLookup.createPlan.hopingToGetWork(id) : addressLookup.createPlan.checkYourAnswers(id),
        page: 'reasonToNotGetWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        reasonToNotGetWork: mode === 'update' ? plan.reasonToNotGetWork : record.reasonToNotGetWork || [],
        reasonToNotGetWorkOther: mode === 'update' ? plan.reasonToNotGetWorkOther : record.reasonToNotGetWorkOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['reasonToNotGetWork', id, 'data'], data)

      res.render('pages/createPlan/reasonToNotGetWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { reasonToNotGetWork = [], reasonToNotGetWorkOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['reasonToNotGetWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/reasonToNotGetWork/index', {
          ...data,
          errors,
          reasonToNotGetWork,
          reasonToNotGetWorkOther,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id], {})
      setSessionData(req, ['createPlan', id], {
        ...record,
        reasonToNotGetWork,
        reasonToNotGetWorkOther: reasonToNotGetWork.includes(ReasonToNotGetWorkValue.OTHER)
          ? reasonToNotGetWorkOther
          : '',
      })

      deleteSessionData(req, ['reasonToNotGetWork', id, 'data'])

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on value
      res.redirect(addressLookup.createPlan.wantsToAddQualifications(id, 'new'))
    } catch (err) {
      next(err)
    }
  }
}
