import type { RequestHandler } from 'express'
import WhereaboutsService from '../../services/whereaboutsService'
import { getSessionData } from '../../utils/session'
import getUnacceptibleAbsenceCount from './utils/getUnacceptableAbsenceCount'

// Gets unacceptable Absences Count based on id parameter and puts it into request context
const getUnacceptableAbsencesCountResolver =
  (whereaboutsService: WhereaboutsService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached unacceptableAbsenceCount
      if (getSessionData(req, ['unacceptableAbsenceCount', id])) {
        req.context.unacceptableAbsenceCount = getSessionData(req, ['unacceptableAbsenceCount', id])
        next()
        return
      }

      const results = await getUnacceptibleAbsenceCount(whereaboutsService, username, id)
      req.context.unacceptableAbsenceCount = results

      next()
    } catch (err) {
      next(err)
    }
  }

export default getUnacceptableAbsencesCountResolver
