import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import CiagService from '../../../services/ciagService'
import { getValueSafely } from '../../../utils'

export default class InPrisonWorkController {
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
        mode === 'new' ? addressLookup.createPlan.additionalTraining(id, mode) : getHubPageByMode(mode, id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        inPrisonWork:
          mode === 'update'
            ? getValueSafely(plan, 'inPrisonInterests.inPrisonWork', [])
            : getValueSafely(record, 'inPrisonWork', []),
        inPrisonWorkOther:
          mode === 'update'
            ? getValueSafely(plan, 'inPrisonInterests.inPrisonWorkOther', [])
            : record.inPrisonWorkOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['inPrisonWork', id, 'data'], data)

      res.render('pages/createPlan/inPrisonWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { inPrisonWork = [], inPrisonWorkOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['inPrisonWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/inPrisonWork/index', {
          ...data,
          errors,
          inPrisonWork,
          inPrisonWorkOther,
        })
        return
      }

      deleteSessionData(req, ['inPrisonWork', id, 'data'])

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
        inPrisonWork,
        inPrisonWorkOther: inPrisonWork.includes(InPrisonWorkValue.OTHER) ? inPrisonWorkOther : '',
      })

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page
      res.redirect(addressLookup.createPlan.inPrisonEducation(id, mode))
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan, prisoner } = req.context
    const { inPrisonWork = [], inPrisonWorkOther } = req.body

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      inPrisonInterests: {
        ...plan.inPrisonInterests,
        inPrisonWork,
        inPrisonWorkOther: inPrisonWork.includes(InPrisonWorkValue.OTHER) ? inPrisonWorkOther : '',
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      },
    }

    // Call api
    await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

    res.redirect(addressLookup.learningPlan.profile(id))
  }
}
