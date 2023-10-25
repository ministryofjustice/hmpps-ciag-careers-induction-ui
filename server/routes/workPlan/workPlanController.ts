import { plainToClass } from 'class-transformer'
import { RequestHandler } from 'express'

import PrisonerViewModel from '../../viewModels/prisonerViewModel'
import addressLookup from '../addressLookup'
import CiagService from '../../services/ciagService'

export default class WorkPlanController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, tab } = req.params
    const { prisoner, plan } = req.context

    try {
      // Redirect to completed profile if plan found
      if (plan) {
        res.redirect(addressLookup.learningPlan.profile(id))
        return
      }

      const data = {
        id,
        prisoner: {
          ...plainToClass(PrisonerViewModel, prisoner),
        },
        tab,
      }

      res.render('pages/workPlan/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
