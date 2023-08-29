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
import getBackLocation from '../../../utils/getBackLocation'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import CiagService from '../../../services/ciagService'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'

export default class WorkDetailsController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode, typeOfWorkExperienceKey } = req.params
    const { prisoner, plan } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Get job details
      const workExperience = mode === 'update' ? plan.workExperience.workExperience : record.workExperience
      const job =
        (workExperience || []).find(
          (q: { typeOfWorkExperience: string }) => q.typeOfWorkExperience === typeOfWorkExperienceKey.toUpperCase(),
        ) || {}

      // Calculate last page
      const typeOfWorkExperience =
        mode === 'update'
          ? _.get(plan, 'workExperience.typeOfWorkExperience', [])
          : _.get(record, 'typeOfWorkExperience', [])
      const position = typeOfWorkExperience.indexOf(typeOfWorkExperienceKey.toUpperCase())
      const lastKey = position > 0 ? typeOfWorkExperience[position - 1] : ''

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new'
            ? lastKey
              ? addressLookup.createPlan.workDetails(id, lastKey, mode)
              : addressLookup.createPlan.typeOfWorkExperience(id, mode)
            : getHubPageByMode(mode, id),
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
    const { plan } = req.context

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

      deleteSessionData(req, ['workDetails', id, 'data'])

      // Calculate next page
      const record = getSessionData(req, ['createPlan', id])
      const position = record.typeOfWorkExperience.indexOf(typeOfWorkExperienceKey.toUpperCase())
      const nextKey = position < record.typeOfWorkExperience.length ? record.typeOfWorkExperience[position + 1] : ''

      // Handle update
      if (mode === 'update') {
        // Update data model
        const updatedPlan = {
          ...plan,
          workExperience: {
            ...plan.workExperience,
            workExperience: [
              ...(plan.workExperience.workExperience || []).filter(
                (w: { typeOfWorkExperience: string }) =>
                  w.typeOfWorkExperience !== typeOfWorkExperienceKey.toUpperCase(),
              ),
              {
                typeOfWorkExperience: typeOfWorkExperienceKey.toUpperCase(),
                role: jobRole,
                details: jobDetails,
              },
            ],
            modifiedBy: res.locals.user.username,
            modifiedDateTime: new Date().toISOString(),
          },
        }

        // Call api
        await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

        res.redirect(
          nextKey
            ? addressLookup.createPlan.workDetails(id, nextKey, mode)
            : addressLookup.createPlan.workInterests(id, mode),
        )
        return
      }

      // Update record in session
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
