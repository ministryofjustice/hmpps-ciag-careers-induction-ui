import type { Router } from 'express'

import { Services } from '../../services'
import CiagListController from './ciagListController'
import getCiagListResolver from '../../middleware/resolvers/getCiagListResolver'
import handleSortMiddleware from '../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new CiagListController(services.paginationService)

  router.get(
    '/',
    [getCiagListResolver(services.prisonerSearchService, services.educationAndWorkPlanService)],
    controller.get,
  )

  router.post('/', [handleSortMiddleware('sortAction', 'lastName')], controller.post)
}
