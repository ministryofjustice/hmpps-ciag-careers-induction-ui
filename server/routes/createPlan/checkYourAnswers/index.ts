import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import CheckYourAnswersController from './checkYourAnswersController'

export default (router: Router, services: Services) => {
  const controller = new CheckYourAnswersController(services.ciagService)

  router.get(
    '/plan/create/:id/check-your-answers',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/check-your-answers',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
