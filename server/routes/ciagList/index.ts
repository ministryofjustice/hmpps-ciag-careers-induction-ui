import type { Router } from 'express'

import { Services } from '../../services'
import CiagListController from './ciagListController'
import getCiagListResolver from '../../middleware/resolvers/getCiagListResolver'
import handleSortMiddleware from '../../middleware/handleSortMiddleware'
import plpFrontendRedirect, { AddressLookupKey } from '../../middleware/plpFrontendRedirect'

export default (router: Router, services: Services) => {
  const controller = new CiagListController(services.paginationService)

  router.get(
    '/',
    [
      plpFrontendRedirect(AddressLookupKey.ciagList),
      getCiagListResolver(services.prisonerSearchService, services.ciagService, services.educationAndWorkPlanService),
    ],
    controller.get,
  )

  router.post(
    '/',
    [plpFrontendRedirect(AddressLookupKey.ciagList), handleSortMiddleware('sortAction', 'lastName')],
    controller.post,
  )
}
