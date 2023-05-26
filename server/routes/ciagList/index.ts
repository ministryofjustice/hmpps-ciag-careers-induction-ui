import type { Router } from 'express'

import { Services } from '../../services'
import CiagListController from './ciagListController'
import getCiagListResolver from '../../middleware/resolvers/getCiagListResolver'

export default (router: Router, services: Services) => {
  const controller = new CiagListController()

  router.get('/', [getCiagListResolver(services.prisonerSearchService)], controller.get)
}
