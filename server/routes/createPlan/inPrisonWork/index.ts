import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import InPrisonWorkController from './inPrisonWorkController'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new InPrisonWorkController(services.ciagService)

  router.get(
    '/plan/create/:id/in-prison-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/in-prison-work/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getCiagPlanByIdResolver(services.ciagService),
      parseCheckBoxValue('inPrisonWork'),
    ],
    controller.post,
  )
}
