import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import AbilityToWorkController from './abilityToWorkController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new AbilityToWorkController(services.ciagService)

  router.get(
    '/plan/create/:id/ability-to-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/ability-to-work/:mode',
    [
      checkSessionPageData('abilityToWork'),
      getPrisonerByIdResolver(services.prisonerSearchService),
      parseCheckBoxValue('abilityToWork'),
    ],
    controller.post,
  )
}
