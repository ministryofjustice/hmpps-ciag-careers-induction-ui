import { plainToClass } from 'class-transformer'
import { RequestHandler } from 'express'

import { getAge } from '../../utils/utils'
import PrisonerViewModel from '../../viewModels/prisonerViewModel'
import { deleteSessionData } from '../../utils/session'

export default class WorkPlanController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, tab } = req.params
    const { prisoner } = req.context

    try {
      deleteSessionData(req, ['editAction', id, 'cachedValues'])

      const data = {
        id,
        prisoner: {
          ...plainToClass(PrisonerViewModel, prisoner),
          age: getAge(prisoner.dateOfBirth),
        },
        tab,
      }

      res.render('pages/workPlan/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
