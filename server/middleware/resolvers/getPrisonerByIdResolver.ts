import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerByIdResolver =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached prisoner
      if (getSessionData(req, ['prisoner', id])) {
        req.context.prisoner = getSessionData(req, ['prisoner', id])
        next()
        return
      }

      // Get prisoner
      req.context.prisoner = await prisonerSearchService.getPrisonerById(username, id)
      setSessionData(req, ['prisoner', id], req.context.prisoner)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getPrisonerByIdResolver
