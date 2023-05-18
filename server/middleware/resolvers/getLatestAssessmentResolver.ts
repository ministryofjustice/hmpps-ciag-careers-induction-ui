import type { RequestHandler } from 'express'

import CuriousEsweService from '../../services/curiousEsweService'
import { getSessionData, setSessionData } from '../../utils/session'
import getLatestAssessment from './utils/getLatestAssessment'

// Gets learner employability skills data held in CuriousApi, based on id parameter and puts it into request context
const getLatestAssessmentResolver =
  (curiousEsweService: CuriousEsweService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached latest assessment data for this prisoner
      if (getSessionData(req, ['learnerLatestAssessment', id])) {
        req.context.learnerLatestAssessment = getSessionData(req, ['learnerLatestAssessment', id])
        next()
        return
      }

      // Get employability skills data
      req.context.learnerLatestAssessment = await getLatestAssessment(curiousEsweService, username, id)
      setSessionData(req, ['learnerLatestAssessment', id], req.context.learnerLatestAssessment)

      next()
    } catch (err) {
      // Handle no employability skills data
      if (
        err?.data?.status === 404 &&
        err?.data?.userMessage.indexOf('There is no assessment data for this prisoner') > -1
      ) {
        next()
        return
      }
      next(err)
    }
  }

export default getLatestAssessmentResolver
