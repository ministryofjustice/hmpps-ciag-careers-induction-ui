/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import CiagService from '../../../services/ciagService'

export default class ParticularJobInterestsController {
  constructor(private readonly ciagService: CiagService) {}

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
        mode === 'new' ? addressLookup.createPlan.workInterests(id, mode) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Build field value
      const particularJobInterests =
        mode === 'update' ? _.get(plan, 'workInterests.particularJobInterests') : record.particularJobInterests

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        workInterests:
          mode === 'update' ? _.get(plan, 'workInterests.workInterests', []) : _.get(record, 'workInterests', []),
        workInterestsOther:
          mode === 'update' ? _.get(plan, 'workInterests.workInterestsOther') : record.workInterestsOther,
        particularJobInterests: (particularJobInterests || []).reduce(
          (acc: { [x: string]: string }, curr: { interestKey: string; jobDetails: string }) => {
            acc[curr.interestKey] = curr.jobDetails
            return acc
          },
          {},
        ),
      }

      // Store page data for use if validation fails
      setSessionData(req, ['particularJobInterests', id, 'data'], data)

      res.render('pages/createPlan/particularJobInterests/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { plan } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['particularJobInterests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/particularJobInterests/index', {
          ...data,
          errors,
          particularJobInterests: { ...req.body },
        })
        return
      }

      deleteSessionData(req, ['particularJobInterests', id, 'data'])

      // Get dynamic form values
      const values = Object.keys(req.body).filter(v => !!req.body[v] && v !== '_csrf')

      // Handle update
      if (mode === 'update') {
        // Update data model
        const updatedPlan = {
          ...plan,
          workInterests: {
            ...plan.workInterests,
            particularJobInterests: values.map(v => ({ interestKey: v, jobDetails: req.body[v] })),
            modifiedBy: res.locals.user.username,
            modifiedDateTime: new Date().toISOString(),
          },
        }

        // Call api, change status
        await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

        // Set redirect destination
        setSessionData(req, ['redirect', id], addressLookup.learningPlan.profile(id))

        res.redirect(addressLookup.redirect(id))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])

      // Get keys of entered job details
      setSessionData(req, ['createPlan', id], {
        ...record,
        particularJobInterests: values.map(v => ({ interestKey: v, jobDetails: req.body[v] })),
      })

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.skills(id))
    } catch (err) {
      next(err)
    }
  }
}
