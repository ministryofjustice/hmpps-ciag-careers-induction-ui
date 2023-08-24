import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import SkillsValue from '../../../enums/skillsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class SkillsController {
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
        mode === 'new'
          ? addressLookup.createPlan.particularJobInterests(id, mode)
          : addressLookup.createPlan.checkYourAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        skills: mode === 'update' ? plan.skillsAndInterests.skills : record.skills || [],
        skillsOther: mode === 'update' ? plan.skillsAndInterests.skillsOther : record.skillsOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['skills', id, 'data'], data)

      res.render('pages/createPlan/skills/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { skills = [], skillsOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['skills', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/skills/index', {
          ...data,
          errors,
          skills,
          skillsOther,
        })
        return
      }

      deleteSessionData(req, ['skills', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        skills,
        skillsOther: skills.includes(SkillsValue.OTHER) ? skillsOther : '',
      })

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.personalInterests(id))
    } catch (err) {
      next(err)
    }
  }
}
