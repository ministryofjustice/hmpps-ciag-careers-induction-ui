import type { RequestHandler } from 'express'

import KeyworkerService from '../../services/keyworkerService'
import { getSessionData, setSessionData } from '../../utils/session'
import getKeyworkerById from './utils/getKeyworkerById'

// Gets keyworker based on id parameter and puts it into request context
const getKeyworkerByIdResolver =
  (keyworkerService: KeyworkerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached keyworker
      if (getSessionData(req, ['keyworker', id])) {
        req.context.keyworker = getSessionData(req, ['keyworker', id])
        next()
        return
      }

      // Get keyworker
      req.context.keyworker = await getKeyworkerById(keyworkerService, username, id)
      setSessionData(req, ['keyworker', id], req.context.keyworker)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getKeyworkerByIdResolver
