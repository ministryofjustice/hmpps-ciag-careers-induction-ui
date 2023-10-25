/* eslint-disable no-nested-ternary */
import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'

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
import { getValueSafely } from '../../../utils/utils'

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
          ? getValueSafely(plan, 'workExperience.typeOfWorkExperience', [])
          : getValueSafely(record, 'typeOfWorkExperience', [])
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
            ? getValueSafely(plan, 'workExperience.workInterests.workInterests', [])
            : getValueSafely(record, 'workInterests', []),
        workInterestsOther:
          mode === 'update'
            ? getValueSafely(plan, 'workExperience.workInterests.workInterestsOther')
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
        this.handleUpdate(req, res)
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        workInterests,
        workInterestsOther: workInterests.includes(WorkInterestsValue.OTHER) ? workInterestsOther : '',
        particularJobInterests: getValueSafely(record, 'particularJobInterests', []).filter(
          (p: { workInterest: string }) => workInterests.includes(p.workInterest),
        ),
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

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan } = req.context
    const { workInterests = [], workInterestsOther } = req.body

    // Update data model
    const updatedPlan = {
      ...plan,
      workExperience: {
        ...plan.workExperience,
        workInterests: {
          ...plan.workExperience.workInterests,
          workInterests,
          workInterestsOther: workInterests.includes(WorkInterestsValue.OTHER) ? workInterestsOther : '',
          particularJobInterests: getValueSafely(
            plan,
            'workExperience.workInterests.particularJobInterests',
            [],
          ).filter((p: { workInterest: string }) => workInterests.includes(p.workInterest)),
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
        },
      },
    }

    // Call api
    await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

    res.redirect(addressLookup.learningPlan.profile(id))
  }
}
