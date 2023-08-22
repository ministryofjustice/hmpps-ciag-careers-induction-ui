import { plainToClass } from 'class-transformer'
import { RequestHandler } from 'express'

import PrisonerViewModel from '../../viewModels/prisonerViewModel'
import { deleteSessionData } from '../../utils/session'

export default class WorkPlanController {
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
}
