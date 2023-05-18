import type { RequestHandler } from 'express'

import AllocationManagerService from '../../services/allocationManagerService'
import { getSessionData, setSessionData } from '../../utils/session'
import getPomById from './utils/getPomById'

// Gets Pom based on id parameter and puts it into request context
const getPomByIdResolver =
  (allocationManagerService: AllocationManagerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached Pom
      if (getSessionData(req, ['pom', id])) {
        req.context.pom = getSessionData(req, ['pom', id])
        next()
        return
      }

      // Get Pom
      req.context.pom = await getPomById(allocationManagerService, username, id)
      setSessionData(req, ['pom', id], req.context.pom)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getPomByIdResolver
