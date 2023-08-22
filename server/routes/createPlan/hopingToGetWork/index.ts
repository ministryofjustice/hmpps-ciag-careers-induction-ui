import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

import type { Services } from '../../../services'
import HopingToGetWorkController from './hopingToGetWorkController'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new HopingToGetWorkController()

  router.get(
    '/plan/create/:id/hoping-to-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/hoping-to-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.post,
  )
}
