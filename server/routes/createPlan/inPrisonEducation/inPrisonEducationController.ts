import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import InPrisonEducationValue from '../../../enums/inPrisonEducationValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'

export default class InPrisonEducationController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // If no record or incorrect value return to hopeToGetWork
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
        inPrisonEducation:
          mode === 'update'
            ? _.get(plan, 'inPrisonInterests.inPrisonEducation', [])
            : _.get(record, 'inPrisonEducation', []),
        inPrisonEducationOther:
          mode === 'update' ? _.get(plan, 'inPrisonInterests.inPrisonEducationOther') : record.inPrisonEducationOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['inPrisonEducation', id, 'data'], data)

      res.render('pages/createPlan/inPrisonEducation/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { inPrisonEducation = [], inPrisonEducationOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['inPrisonEducation', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/inPrisonEducation/index', {
          ...data,
          errors,
          inPrisonEducation,
          inPrisonEducationOther,
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
        inPrisonEducationOther: inPrisonEducation.includes(InPrisonEducationValue.OTHER) ? inPrisonEducationOther : '',
      })

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.checkYourAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
