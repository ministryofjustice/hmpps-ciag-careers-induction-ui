/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import YesNoValue from '../../../enums/yesNoValue'

export default class HasWorkedBeforeController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record || record.hopingToGetWork !== HopingToGetWorkValue.YES) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation =
        mode !== 'edit'
          ? addressLookup.createPlan.otherQualifications(id, mode)
          : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        hasWorkedBefore: record.hasWorkedBefore,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['hasWorkedBefore', id, 'data'], data)

      res.render('pages/createPlan/hasWorkedBefore/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { hasWorkedBefore } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['hasWorkedBefore', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/hasWorkedBefore/index', {
          ...data,
          errors,
          hasWorkedBefore,
        })
        return
      }

      // Update record in session
      const record = getSessionData(req, ['createPlan', id])
      deleteSessionData(req, ['hasWorkedBefore', id, 'data'])

      setSessionData(req, ['createPlan', id], {
        ...record,
        hasWorkedBefore,
      })

      // Default flow
      res.redirect(
        hasWorkedBefore === YesNoValue.YES
          ? addressLookup.createPlan.typeOfWorkExperience(id, mode)
          : addressLookup.createPlan.workInterests(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }
}
