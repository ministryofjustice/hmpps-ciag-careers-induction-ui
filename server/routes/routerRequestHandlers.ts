import { NextFunction, Request, Response, RequestHandler } from 'express'
import createError from 'http-errors'
import { CiagService } from '../services'
import logger from '../../logger'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction via the [CiagService] and
 *  store in the express request context.
 */
const retrieveInduction = (ciagService: CiagService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id: prisonNumber } = req.params
    const { user } = res.locals

    try {
      req.context.plan = await ciagService.getCiagPlan(user.token, prisonNumber)
      next()
    } catch (error) {
      logger.error(`Error retrieving Induction for Prisoner ${prisonNumber}`, error)
      next(createError(error.status, `Induction for Prisoner ${prisonNumber} not returned by the Induction API`))
    }
  }
}

export default retrieveInduction
