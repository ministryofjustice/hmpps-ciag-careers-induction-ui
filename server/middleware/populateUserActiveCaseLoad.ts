import { RequestHandler } from 'express'
import PrisonerSearchService, { UserActiveCaseLoad } from '../services/prisonSearchService'

// Adds the users current active case load to the res.locals for the breadcrumbs
const populateUserActiveCaseLoad = (prisonerSearchService: PrisonerSearchService): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userActiveCaseLoad: UserActiveCaseLoad = await prisonerSearchService.getUserActiveCaseLoad(
        res.locals.user.token,
      )

      res.locals.userActiveCaseLoad = userActiveCaseLoad

      next()
    } catch (err) {
      next(err)
    }
  }
}

export default populateUserActiveCaseLoad
