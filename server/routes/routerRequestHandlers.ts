import { NextFunction, Request, Response, RequestHandler } from 'express'
import createError from 'http-errors'
import { CiagService, InductionService } from '../services'
import logger from '../../logger'
import config from '../config'
import toCiagPlan from '../data/mappers/ciagPlanMapper'

/**
 *  Middleware function that returns a Request handler function to retrieve the [InductionDto] via the [InductionService]
 *  and store in the express request context as a [CiagPlan].
 */
const retrieveInduction = (ciagService: CiagService, inductionService: InductionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id: prisonNumber } = req.params
    const { user } = res.locals

    try {
      if (config.featureToggles.useNewInductionApiEnabled) {
        const inductionDto = await inductionService.getInduction(prisonNumber, user.token)
        req.context.plan = toCiagPlan(inductionDto)
      } else {
        req.context.plan = await ciagService.getCiagPlan(user.token, prisonNumber)
      }
      next()
    } catch (error) {
      logger.error(`Error retrieving Induction for Prisoner ${prisonNumber}`, error)
      next(createError(error.status, `Induction for Prisoner ${prisonNumber} not returned by the Induction API`))
    }
  }
}

export default retrieveInduction
