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

export default class QualificationLevelController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode, qualificationId } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record || record.hopingToGetWork !== HopingToGetWorkValue.YES) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Get or setup qualification
      const qualification = record.qualifications.find((q: { id: string }) => q.id === qualificationId) || {
        id: qualificationId,
      }

      // Setup back location
      const backLocation =
        mode !== 'edit' ? addressLookup.createPlan.educationLevel(id) : addressLookup.createPlan.qualifications(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        educationLevel: record.educationLevel,
        qualificationLevel: qualification.level,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['qualificationLevel', id, 'data'], data)

      res.render('pages/createPlan/qualificationLevel/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode, qualificationId } = req.params
    const { qualificationLevel } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['qualificationLevel', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/qualificationLevel/index', {
          ...data,
          errors,
          qualificationLevel,
        })
        return
      }

      // Update record in session
      const record = getSessionData(req, ['createPlan', id])
      const qualification = record.qualifications.find((q: { id: string }) => q.id === qualificationId) || {
        id: qualificationId,
      }
      setSessionData(req, ['createPlan', id], {
        ...record,
        qualifications: [
          ...record.qualifications.filter((q: { id: string }) => q.id !== qualificationId),
          {
            ...qualification,
            level: qualificationLevel,
          },
        ],
      })

      deleteSessionData(req, ['qualificationLevel', id, 'data'])

      res.redirect(addressLookup.createPlan.qualificationDetails(id, qualificationId, mode))
    } catch (err) {
      next(err)
    }
  }
}
