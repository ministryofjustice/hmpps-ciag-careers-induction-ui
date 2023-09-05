import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import AdditionalTrainingController from './additionalTrainingController'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new AdditionalTrainingController(services.ciagService)

  router.get(
    '/plan/create/:id/additional-training/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/additional-training/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getCiagPlanByIdResolver(services.ciagService),
      parseCheckBoxValue('additionalTraining'),
    ],
    controller.post,
  )
}
