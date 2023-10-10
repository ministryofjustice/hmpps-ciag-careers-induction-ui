/* eslint-disable no-nested-ternary */
import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import YesNoValue from '../../../enums/yesNoValue'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import CiagService from '../../../services/ciagService'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'

export default class HasWorkedBeforeController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation =
        mode === 'new' ? addressLookup.createPlan.additionalTraining(id, mode) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        hasWorkedBefore:
          mode === 'update'
            ? _.get(record, 'workExperience.hasWorkedBefore')
              ? YesNoValue.YES
              : YesNoValue.NO
            : record.hasWorkedBefore,
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

      deleteSessionData(req, ['hasWorkedBefore', id, 'data'])

      // Handle update
      if (mode === 'update') {
        this.handleUpdate(req, res)
        return
      }

      // Update record in session
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        hasWorkedBefore,
        workExperience: hasWorkedBefore === YesNoValue.YES ? record.workExperience : [],
        typeOfWorkExperience: hasWorkedBefore === YesNoValue.YES ? record.typeOfWorkExperience : [],
        typeOfWorkExperienceOther: hasWorkedBefore === YesNoValue.YES ? record.typeOfWorkExperienceOther : '',
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

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan } = req.context
    const { hasWorkedBefore } = req.body

    // Update data model
    const updatedPlan = {
      ...plan,
      workExperience: {
        ...plan.workExperience,
        hasWorkedBefore: hasWorkedBefore === YesNoValue.YES,
        workExperience: hasWorkedBefore === YesNoValue.YES ? plan.workExperience.workExperience : [],
        typeOfWorkExperience: hasWorkedBefore === YesNoValue.YES ? plan.workExperience.typeOfWorkExperience : [],
        typeOfWorkExperienceOther:
          hasWorkedBefore === YesNoValue.YES ? plan.workExperience.typeOfWorkExperienceOther : '',
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      },
    }

    // Call api
    await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

    res.redirect(addressLookup.learningPlan.profile(id))
  }
}
