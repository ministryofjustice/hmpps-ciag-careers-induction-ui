import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import { deleteSessionData } from '../../utils/session'
import CiagListViewModel from '../../viewModels/ciagListViewModel'

export default class CiagListController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { ciagList } = req.context

    try {
      deleteSessionData(req, ['ciagList', 'cachedValues'])

      const data = {
        prisonerSearchResults: {
          ...plainToClass(CiagListViewModel, ciagList.content),
        },
      }

      res.render('pages/ciagList/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
