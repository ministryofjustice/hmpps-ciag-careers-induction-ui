import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import CiagService from '../../../services/ciagService'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'

export default class ReasonToNotGetWorkController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createPlan', id], {})

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: mode === 'new' ? addressLookup.createPlan.hopingToGetWork(id) : getHubPageByMode(mode, id),
        page: 'reasonToNotGetWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        reasonToNotGetWork:
          mode === 'update' ? _.get(plan, 'reasonToNotGetWork', []) : _.get(record, 'reasonToNotGetWork', []),
        reasonToNotGetWorkOther: mode === 'update' ? plan.reasonToNotGetWorkOther : record.reasonToNotGetWorkOther,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['reasonToNotGetWork', id, 'data'], data)

      res.render('pages/createPlan/reasonToNotGetWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { reasonToNotGetWork = [], reasonToNotGetWorkOther } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['reasonToNotGetWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/reasonToNotGetWork/index', {
          ...data,
          errors,
          reasonToNotGetWork,
          reasonToNotGetWorkOther,
        })
        return
      }

      deleteSessionData(req, ['reasonToNotGetWork', id, 'data'])

      // Handle update
      if (mode === 'update') {
        this.handleUpdate(req, res)
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id], {})
      setSessionData(req, ['createPlan', id], {
        ...record,
        reasonToNotGetWork,
        reasonToNotGetWorkOther: reasonToNotGetWork.includes(ReasonToNotGetWorkValue.OTHER)
          ? reasonToNotGetWorkOther
          : '',
      })

      // Handle edit
      if (mode === 'edit') {
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Redirect to the correct page based on if there are existing qualifications
      res.redirect(
        record.qualifications?.length
          ? addressLookup.createPlan.qualifications(id, mode)
          : addressLookup.createPlan.wantsToAddQualifications(id, mode),
      )
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan } = req.context
    const { reasonToNotGetWork = [], reasonToNotGetWorkOther } = req.body

    // Update data model
    const updatedPlan = {
      ...plan,
      reasonToNotGetWork,
      reasonToNotGetWorkOther: reasonToNotGetWork.includes(ReasonToNotGetWorkValue.OTHER)
        ? reasonToNotGetWorkOther
        : '',
      modifiedBy: res.locals.user.username,
      modifiedDateTime: new Date().toISOString(),
    }

    // Call api
    await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))

    res.redirect(addressLookup.learningPlan.profile(id))
  }
}
