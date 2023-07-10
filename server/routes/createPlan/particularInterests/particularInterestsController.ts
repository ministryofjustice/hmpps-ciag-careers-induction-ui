/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class ParticularInterestsController {
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
        mode === 'new' ? addressLookup.createPlan.workInterests(id, mode) : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        workInterests: record.workInterests,
        workInterestsDetails: record.workInterestsDetails,
        particularInterests: (record.particularInterests || []).reduce(
          (acc: { [x: string]: string }, curr: { interestKey: string; jobDetails: string }) => {
            acc[curr.interestKey] = curr.jobDetails
            return acc
          },
          {},
        ),
      }

      // Store page data for use if validation fails
      setSessionData(req, ['particularInterests', id, 'data'], data)

      res.render('pages/createPlan/particularInterests/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['particularInterests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/particularInterests/index', {
          ...data,
          errors,
          particularInterests: { ...req.body },
        })
        return
      }

      deleteSessionData(req, ['particularInterests', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])

      // Get keys of entered job details
      const values = Object.keys(req.body).filter(v => !!req.body[v])
      setSessionData(req, ['createPlan', id], {
        ...record,
        particularInterests: values.map(v => ({ interestKey: v, jobDetails: req.body[v] })),
      })

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.skills(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
