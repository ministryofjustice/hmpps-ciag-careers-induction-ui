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
import getBackLocation from '../../../utils/getBackLocation'

export default class WorkDetailsController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode, typeOfWorkKey } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record || record.hopingToGetWork !== HopingToGetWorkValue.YES) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Get job details
      const job =
        record.workExperience?.find((q: { typeOfWork: string }) => q.typeOfWork === typeOfWorkKey.toUpperCase()) || {}

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new' ? addressLookup.createPlan.typeOfWork(id, mode) : addressLookup.createPlan.checkAnswers(id),
        page: 'workDetails',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWorkKey: typeOfWorkKey.toUpperCase(),
        jobRole: job.role,
        jobDetails: job.details,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['workDetails', id, 'data'], data)

      res.render('pages/createPlan/workDetails/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode, typeOfWorkKey } = req.params
    const { jobRole, jobDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['workDetails', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/workDetails/index', {
          ...data,
          errors,
          jobRole,
          jobDetails,
        })
        return
      }

      // Update record in session
      const record = getSessionData(req, ['createPlan', id])
      const job = record.workExperience.find(
        (q: { typeOfWork: string }) => q.typeOfWork === typeOfWorkKey.toUpperCase(),
      )
      setSessionData(req, ['createPlan', id], {
        ...record,
        workExperience: [
          ...record.workExperience.filter((q: { typeOfWork: string }) => q.typeOfWork !== typeOfWorkKey.toUpperCase()),
          {
            ...job,
            role: jobRole,
            details: jobDetails,
          },
        ],
      })

      deleteSessionData(req, ['workDetails', id, 'data'])

      res.redirect(addressLookup.createPlan.inPrisonWork(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
