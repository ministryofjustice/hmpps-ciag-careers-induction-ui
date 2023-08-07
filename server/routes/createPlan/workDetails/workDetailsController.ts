/* eslint-disable no-nested-ternary */
import _ from 'lodash'
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
    const { id, mode, typeOfWorkExperienceKey } = req.params
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
          (q: { typeOfWorkExperience: string }) => q.typeOfWorkExperience === typeOfWorkExperienceKey.toUpperCase(),
        ) || {}

      // Setup back location

      // Calculate last page
      const position = record.typeOfWorkExperience.indexOf(typeOfWorkExperienceKey.toUpperCase())
      const lastKey = position > 0 ? record.typeOfWorkExperience[position - 1] : ''

      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new'
            ? lastKey
              ? addressLookup.createPlan.workDetails(id, lastKey, mode)
              : addressLookup.createPlan.typeOfWorkExperience(id, mode)
            : addressLookup.createPlan.checkYourAnswers(id),
        page: 'workDetails',
        uid: `${id}-${typeOfWorkExperienceKey}`,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWorkExperienceKey: typeOfWorkExperienceKey.toUpperCase(),
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
    const { id, mode, typeOfWorkExperienceKey } = req.params
    const { from } = req.query
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
        workExperience: _.orderBy(
          [
            ...(record.workExperience || []).filter(
              (q: { typeOfWorkExperience: string }) => q.typeOfWorkExperience !== typeOfWorkExperienceKey.toUpperCase(),
            ),
            {
              typeOfWorkExperience: typeOfWorkExperienceKey.toUpperCase(),
              role: jobRole,
              details: jobDetails,
            },
          ],
          ['typeOfWorkExperience'],
          ['asc'],
        ),
      })

      deleteSessionData(req, ['workDetails', id, 'data'])

      // Calculate next page
      const position = record.typeOfWorkExperience.indexOf(typeOfWorkExperienceKey.toUpperCase())
      const nextKey = position < record.typeOfWorkExperience.length ? record.typeOfWorkExperience[position + 1] : ''

      // Handle edit
      if (mode === 'edit' && (!nextKey || from)) {
        res.redirect(from ? data.backLocation : addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Default flow
      res.redirect(
        nextKey
          ? addressLookup.createPlan.workDetails(id, nextKey, mode)
          : addressLookup.createPlan.workInterests(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }
}
