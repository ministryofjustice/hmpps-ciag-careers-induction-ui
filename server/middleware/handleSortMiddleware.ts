import { NextFunction, Request, Response } from 'express'
import { buildSortUrl, SortOrder } from '../utils/columnSort'

const handleSortMiddleware =
  (formFieldName: string, defaultSort: string, defaultOrder?: SortOrder) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.body[formFieldName]) {
      res.redirect(
        buildSortUrl({
          query: req.query,
          sortField: req.body[formFieldName],
          currentUrl: req.originalUrl,
          defaultSort,
          defaultOrder,
        }),
      )
      return
    }
    next()
  }

export default handleSortMiddleware
