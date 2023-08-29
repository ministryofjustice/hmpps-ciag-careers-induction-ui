import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import CiagService from '../../../services/ciagService'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'

export default class PersonalInterestsController {
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
      const backLocation = mode === 'new' ? addressLookup.createPlan.skills(id, mode) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        personalInterests:
          mode === 'update'
            ? _.get(plan, 'skillsAndInterests.personalInterests', [])
            : _.get(record, 'personalInterests', []),
        personalInterestsOther:
          mode === 'update' ? _.get(plan, 'skillsAndInterests.personalInterestsOther') : record.personalInterestsOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['personalInterests', id, 'data'], data)

      res.render('pages/createPlan/personalInterests/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { personalInterests = [], personalInterestsOther } = req.body
    const { plan } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['personalInterests', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/personalInterests/index', {
          ...data,
          errors,
          personalInterests,
          personalInterestsOther,
        })
        return
      }

      deleteSessionData(req, ['personalInterests', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        const updatedPlan = {
          ...plan,
          skillsAndInterests: {
            ...plan.skillsAndInterests,
            personalInterests,
            personalInterestsOther: personalInterests.includes(PersonalInterestsValue.OTHER)
              ? personalInterestsOther
              : '',
            modifiedBy: res.locals.user.username,
            modifiedDateTime: new Date().toISOString(),
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
        personalInterests,
        personalInterestsOther: personalInterests.includes(PersonalInterestsValue.OTHER) ? personalInterestsOther : '',
      })

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.abilityToWork(id))
    } catch (err) {
      next(err)
    }
  }
}
