import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import type { Services } from '../../../services'
import ReasonToNotGetWorkController from './reasonToNotGetWorkController'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new ReasonToNotGetWorkController()

  router.get(
    '/plan/create/:id/reason-to-not-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/reason-to-not-get-work/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getCiagPlanByIdResolver(services.ciagService),
      parseCheckBoxValue('reasonToNotGetWork'),
    ],
    controller.post,
  )
}
