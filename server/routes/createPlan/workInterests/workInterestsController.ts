/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class WorkInterestsController {
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

      const lastKey = record.typeOfWorkExperience ? record.typeOfWorkExperience.at(-1) : ''

      // Setup back location
      const backLocation =
        mode === 'new'
          ? lastKey
            ? addressLookup.createPlan.workDetails(id, lastKey, mode)
            : addressLookup.createPlan.hasWorkedBefore(id, mode)
          : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        workInterests: record.workInterests || [],
        workInterestsDetails: record.workInterestsDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['workInterests', id, 'data'], data)

      res.render('pages/createPlan/workInterests/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { workInterests = [], workInterestsDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['workInterests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/workInterests/index', {
          ...data,
          errors,
          workInterests,
          workInterestsDetails,
        })
        return
      }

      deleteSessionData(req, ['workInterests', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        workInterests,
        workInterestsDetails: workInterests.includes(WorkInterestsValue.OTHER) ? workInterestsDetails : '',
      })

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.jobOfParticularInterest(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
