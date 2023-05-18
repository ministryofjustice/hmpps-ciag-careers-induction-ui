import type { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'
import { getSessionData, setSessionData } from '../../utils/session'
import getCurrentOffenderActivities from './utils/getCurrentOffenderActivities'

// Gets current Offender Activities based on id parameter and puts it into request context
const getCurrentOffenderActivitiesResolver =
  (prisonService: PrisonService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached currentOffenderActivities
      if (getSessionData(req, ['currentOffenderActivities', id])) {
        req.context.currentOffenderActivities = getSessionData(req, ['currentOffenderActivities', id])
        next()
        return
      }

      req.context.currentOffenderActivities = await getCurrentOffenderActivities(prisonService, username, id)
      setSessionData(req, ['currentOffenderActivities', id], req.context.currentOffenderActivities)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCurrentOffenderActivitiesResolver
