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
        (record.workExperience || []).find(
          (q: { typeOfWork: string }) => q.typeOfWork === typeOfWorkKey.toUpperCase(),
        ) || {}

      // Setup back location

      // Calculate last page
      const position = record.typeOfWork.indexOf(typeOfWorkKey.toUpperCase())
      const lastKey = position > 0 ? record.typeOfWork[position - 1] : ''

      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new'
            ? lastKey
              ? addressLookup.createPlan.workDetails(id, lastKey, mode)
              : addressLookup.createPlan.typeOfWork(id, mode)
            : addressLookup.createPlan.checkAnswers(id),
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
      setSessionData(req, ['createPlan', id], {
        ...record,
        workExperience: [
          ...(record.workExperience || []).filter(
            (q: { typeOfWork: string }) => q.typeOfWork !== typeOfWorkKey.toUpperCase(),
          ),
          {
            typeOfWork: typeOfWorkKey.toUpperCase(),
            role: jobRole,
            details: jobDetails,
          },
        ],
      })

      deleteSessionData(req, ['workDetails', id, 'data'])

      // Calculate next page
      const position = record.typeOfWork.indexOf(typeOfWorkKey.toUpperCase())
      const nextKey = position < record.typeOfWork.length ? record.typeOfWork[position + 1] : ''

      res.redirect(
        nextKey
          ? addressLookup.createPlan.workDetails(id, nextKey, mode)
          : addressLookup.createPlan.inPrisonWork(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }
}
