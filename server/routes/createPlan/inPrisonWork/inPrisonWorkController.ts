import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'

export default class InPrisonWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // If no record or plan
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation =
        mode === 'new' ? addressLookup.createPlan.additionalTraining(id, mode) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        inPrisonWork:
          mode === 'update' ? _.get(plan, 'inPrisonInterests.inPrisonWork', []) : _.get(record, 'inPrisonWork', []),
        inPrisonWorkOther:
          mode === 'update' ? _.get(plan, 'inPrisonInterests.inPrisonWorkOther', []) : record.inPrisonWorkOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['inPrisonWork', id, 'data'], data)

      res.render('pages/createPlan/inPrisonWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { inPrisonWork = [], inPrisonWorkOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['inPrisonWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/inPrisonWork/index', {
          ...data,
          errors,
          inPrisonWork,
          inPrisonWorkOther,
        })
        return
      }

      deleteSessionData(req, ['inPrisonWork', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        inPrisonWork,
        inPrisonWorkOther: inPrisonWork.includes(InPrisonWorkValue.OTHER) ? inPrisonWorkOther : '',
      })

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.inPrisonEducation(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
