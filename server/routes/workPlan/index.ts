import type { Router } from 'express'

import { Services } from '../../services'
import WorkPlanController from './workPlanController'
import getPrisonerByIdResolver from '../../middleware/resolvers/getPrisonerByIdResolver'
import getCiagPlanByIdResolver from '../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new WorkPlanController(services.ciagService)

  router.get(
    '/plan/:id/view/:tab',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.get,
  )
}
