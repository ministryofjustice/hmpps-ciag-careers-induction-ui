import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets prisoners list based on user's caseloadId parameter and puts it into request context
const getCiagListResolver =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username, token } = res.locals.user
    const { userActiveCaseLoad } = res.locals

    try {
      // Check session for cached prisoners list
      if (getSessionData(req, ['ciagList'])) {
        req.context.ciagList = getSessionData(req, ['ciagList'])
        next()
        return
      }

      // Get prisoners list
      req.context.ciagList = await prisonerSearchService.getPrisonerByCaseloadID(
        username,
        userActiveCaseLoad.caseLoadId,
      )
      setSessionData(req, ['ciagList'], req.context.ciagList)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCiagListResolver
