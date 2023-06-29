import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class TypeOfWorkExperienceController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to hopeToGetWorkz
      const record = getSessionData(req, ['createPlan', id])
      if (!record || !record.hopingToGetWork) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation =
        mode === 'new' ? addressLookup.createPlan.hasWorkedBefore(id, mode) : addressLookup.createPlan.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWorkExperience: record.typeOfWorkExperience || [],
        typeOfWorkExperienceDetails: record.typeOfWorkExperienceDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['typeOfWorkExperience', id, 'data'], data)

      res.render('pages/createPlan/typeOfWorkExperience/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { typeOfWorkExperience = [], typeOfWorkExperienceDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['typeOfWorkExperience', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/typeOfWorkExperience/index', {
          ...data,
          errors,
          typeOfWorkExperience,
          typeOfWorkExperienceDetails,
        })
        return
      }

      deleteSessionData(req, ['typeOfWorkExperience', id, 'data'])

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        typeOfWorkExperience,
        typeOfWorkExperienceDetails: typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER)
          ? typeOfWorkExperienceDetails
          : '',
        workExperience: (record.workExperience || []).filter((j: { typeOfWorkExperience: string }) =>
          typeOfWorkExperience.includes(j.typeOfWorkExperience),
        ),
      })

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.workDetails(id, typeOfWorkExperience[0], mode))
    } catch (err) {
      next(err)
    }
  }
}
