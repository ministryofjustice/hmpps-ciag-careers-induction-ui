import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import CiagService from '../../../services/ciagService'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'

export default class AbilityToWorkController {
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
        mode === 'new' ? addressLookup.createPlan.personalInterests(id, mode) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        abilityToWork: mode === 'update' ? _.get(plan, 'abilityToWork', []) : _.get(record, 'abilityToWork', []),
        abilityToWorkOther: mode === 'update' ? plan.abilityToWorkOther : record.abilityToWorkOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['abilityToWork', id, 'data'], data)

      res.render('pages/createPlan/abilityToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { abilityToWork = [], abilityToWorkOther } = req.body
    const { plan } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['abilityToWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/abilityToWork/index', {
          ...data,
          errors,
          abilityToWork,
          abilityToWorkOther,
        })
        return
      }

      deleteSessionData(req, ['abilityToWork', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        const updatedPlan = {
          ...plan,
          abilityToWork,
          abilityToWorkOther: abilityToWork.includes(AbilityToWorkValue.OTHER) ? abilityToWorkOther : '',
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
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
      setSessionData(req, ['createPlan', id], {
        ...record,
        abilityToWork,
        abilityToWorkOther: abilityToWork.includes(AbilityToWorkValue.OTHER) ? abilityToWorkOther : '',
      })

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.checkYourAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
