/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import CiagService from '../../../services/ciagService'

export default class WorkInterestsController {
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

      // Get last key
      const typeOfWorkExperience =
        mode === 'update'
          ? _.get(plan, 'workExperience.typeOfWorkExperience', [])
          : _.get(record, 'typeOfWorkExperience', [])
      const lastKey = typeOfWorkExperience ? typeOfWorkExperience.at(-1) : ''

      // Setup back location
      const backLocation =
        mode === 'new'
          ? lastKey
            ? addressLookup.createPlan.workDetails(id, lastKey, mode)
            : addressLookup.createPlan.hasWorkedBefore(id, mode)
          : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        workInterests:
          mode === 'update'
            ? _.get(plan, 'workExperience.workInterests.workInterests', [])
            : _.get(record, 'workInterests', []),
        workInterestsOther:
          mode === 'update'
            ? _.get(plan, 'workExperience.workInterests.workInterestsOther')
            : record.workInterestsOther,
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
    const { workInterests = [], workInterestsOther } = req.body
    const { plan } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['workInterests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/workInterests/index', {
          ...data,
          errors,
          workInterests,
          workInterestsOther,
        })
        return
      }

      deleteSessionData(req, ['workInterests', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        const updatedPlan = {
          ...plan,
          workExperience: {
            ...plan.workExperience,
            workInterests: {
              ...plan.workExperience.workInterests,
              workInterests,
              workInterestsOther: workInterests.includes(WorkInterestsValue.OTHER) ? workInterestsOther : '',
              modifiedBy: res.locals.user.username,
              modifiedDateTime: new Date().toISOString(),
            },
          },
        }

        // Call api
        await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

        // Set redirect destination
        setSessionData(req, ['redirect', id], addressLookup.learningPlan.profile(id))

        res.redirect(addressLookup.redirect(id))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        workInterests,
        workInterestsOther: workInterests.includes(WorkInterestsValue.OTHER) ? workInterestsOther : '',
      })

      // Handle edit and update
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.particularJobInterests(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
