import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'

// Gets prisoners list based on user's caseloadId parameter and puts it into request context
const getCiagListResolver =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { userActiveCaseLoad } = res.locals

    try {
      // Get prisoners list
      req.context.ciagList = await prisonerSearchService.getPrisonersByCaseloadID(
        username,
        userActiveCaseLoad.caseLoadId,
      )

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCiagListResolver
