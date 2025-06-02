import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

import type { Services } from '../../../services'
import HopingToGetWorkController from './hopingToGetWorkController'

export default (router: Router, services: Services) => {
  const controller = new HopingToGetWorkController(services.inductionService)

  router.get(
    '/plan/create/:id/hoping-to-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/hoping-to-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
