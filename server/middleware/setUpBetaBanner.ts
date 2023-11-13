import { Router } from 'express'
import config from '../config'

// Add beta banner URLs to locals
export default function setUpBetaBanner(): Router {
  const router = Router({ mergeParams: true })

  router.use((req, res, next) => {
    res.locals.isBeta = config.isBeta === 'true'
    res.locals.betaHelpLink = config.betaHelpLink
    res.locals.betaFeedbackLink = config.betaFeedbackLink

    next()
  })

  return router
}
