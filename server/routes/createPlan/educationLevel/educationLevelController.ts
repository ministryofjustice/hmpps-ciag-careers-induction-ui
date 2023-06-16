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
import EducationLevelValue from '../../../enums/educationLevelValue'
import uuidv4 from '../../../utils/guid'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'

export default class EducationLevelController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record || record.hopingToGetWork !== HopingToGetWorkValue.YES) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation =
        mode !== 'edit' ? addressLookup.createPlan.qualifications(id) : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        educationLevel: record.educationLevel,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['educationLevel', id, 'data'], data)

      res.render('pages/createPlan/educationLevel/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { educationLevel } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['educationLevel', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/educationLevel/index', {
          ...data,
          errors,
          educationLevel,
        })
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      deleteSessionData(req, ['educationLevel', id, 'data'])

      // Handle higher qualifications
      if (
        [EducationLevelValue.UNDERGRADUATE_DEGREE, EducationLevelValue.POSTGRADUATE_DEGREE].includes(educationLevel)
      ) {
        const newid = uuidv4()
        // Handle qualifications collection
        setSessionData(req, ['createPlan', id], {
          ...record,
          educationLevel,
          qualifications: [
            {
              id: newid,
              level: educationLevel,
            },
          ],
        })

        res.redirect(
          `${addressLookup.createPlan.qualificationDetails(id, newid, mode)}?from=${encryptUrlParameter(
            req.originalUrl,
          )}`,
        )
        return
      }

      // Handle  qualifications collection
      setSessionData(req, ['createPlan', id], {
        ...record,
        educationLevel,
        qualifications: [],
      })

      // Handle secondary qualifications
      if (
        [EducationLevelValue.SECONDARY_SCHOOL_EXAMS, EducationLevelValue.FURTHER_EDUCATION_COLLEGE].includes(
          educationLevel,
        )
      ) {
        res.redirect(addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode))
        return
      }

      // Default no qualifications
      res.redirect(addressLookup.createPlan.otherQualifications(id, mode))
    } catch (err) {
      next(err)
    }
  }
}
