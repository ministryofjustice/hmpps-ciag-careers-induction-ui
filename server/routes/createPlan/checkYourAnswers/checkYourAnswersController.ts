import { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class CheckYourAnswersController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record || !record.hopingToGetWork) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      const data = {
        id,
        record,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        statusChange: getSessionData(req, ['changeStatus', id], false),
      }

      res.render('pages/createPlan/checkYourAnswers/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    //  const { prisoner } = req.context

    try {
      // const record = getSessionData(req, ['createPlan', id])
      // const statusChange = getSessionData(req, ['changeStatus', id])

      // const newRecord = {}

      // Tidy up record in session
      deleteSessionData(req, ['createPlan', id])
      deleteSessionData(req, ['changeStatus', id])

      res.redirect(addressLookup.prisonerSearch())
    } catch (err) {
      next(err)
    }
  }
}
