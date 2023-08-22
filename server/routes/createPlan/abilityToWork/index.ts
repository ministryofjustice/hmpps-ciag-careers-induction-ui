import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'

import AbilityToWorkController from './abilityToWorkController'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new AbilityToWorkController()

  router.get(
    '/plan/create/:id/ability-to-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/ability-to-work/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getCiagPlanByIdResolver(services.ciagService),
      parseCheckBoxValue('abilityToWork'),
    ],
    controller.post,
  )
}
