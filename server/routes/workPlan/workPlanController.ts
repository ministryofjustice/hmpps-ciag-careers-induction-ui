import { plainToClass } from 'class-transformer'
import { RequestHandler } from 'express'

import PrisonerViewModel from '../../viewModels/prisonerViewModel'
import { deleteSessionData, setSessionData } from '../../utils/session'
import addressLookup from '../addressLookup'
import CiagService from '../../services/ciagService'

export default class WorkPlanController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, tab } = req.params
    const { prisoner, plan } = req.context

    try {
      deleteSessionData(req, ['editAction', id, 'cachedValues'])

      const data = {
        id,
        prisoner: {
          ...plainToClass(PrisonerViewModel, prisoner),
        },
        plan,
        tab,
      }

      res.render('pages/workPlan/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  // TODO: Remove when dev is complete
  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    await this.ciagService.deleteCiagPlan(res.locals.user.token, id)

    res.redirect(addressLookup.prisonerSearch())
  }
}
