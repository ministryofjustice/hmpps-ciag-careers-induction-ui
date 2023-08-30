import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import CiagService from '../../../services/ciagService'

export default class TypeOfWorkExperienceController {
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
        mode === 'new' ? addressLookup.createPlan.hasWorkedBefore(id, mode) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWorkExperience:
          mode === 'update'
            ? _.get(plan, 'workExperience.typeOfWorkExperience', [])
            : _.get(record, 'typeOfWorkExperience', []),
        typeOfWorkExperienceOther:
          mode === 'update'
            ? _.get(plan, 'workExperience.typeOfWorkExperienceOther')
            : record.typeOfWorkExperienceOther,
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
    const { typeOfWorkExperience = [], typeOfWorkExperienceOther } = req.body
    const { plan } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['typeOfWorkExperience', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/typeOfWorkExperience/index', {
          ...data,
          errors,
          typeOfWorkExperience,
          typeOfWorkExperienceOther,
        })
        return
      }

      deleteSessionData(req, ['typeOfWorkExperience', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        const updatedPlan = {
          ...plan,
          workExperience: {
            ...plan.workExperience,
            typeOfWorkExperience,
            typeOfWorkExperienceOther: typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER)
              ? typeOfWorkExperienceOther
              : '',
            workExperience: (plan.workExperience.workExperience || []).filter((j: { typeOfWorkExperience: string }) =>
              typeOfWorkExperience.includes(j.typeOfWorkExperience),
            ),
            modifiedBy: res.locals.user.username,
            modifiedDateTime: new Date().toISOString(),
          },
        }

        // Call api
        await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

        res.redirect(addressLookup.createPlan.workDetails(id, typeOfWorkExperience.sort()[0], mode))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])
      setSessionData(req, ['createPlan', id], {
        ...record,
        typeOfWorkExperience,
        typeOfWorkExperienceOther: typeOfWorkExperience.includes(TypeOfWorkExperienceValue.OTHER)
          ? typeOfWorkExperienceOther
          : '',
        workExperience: (record.workExperience || []).filter((j: { typeOfWorkExperience: string }) =>
          typeOfWorkExperience.includes(j.typeOfWorkExperience),
        ),
      })

      // Redirect to the correct page based on hopingToGetWork
      res.redirect(addressLookup.createPlan.workDetails(id, typeOfWorkExperience.sort()[0], mode))
    } catch (err) {
      next(err)
    }
  }
}
