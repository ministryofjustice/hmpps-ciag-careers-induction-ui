import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'

import PersonalInterestsController from './personalInterestsController'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new PersonalInterestsController()

  router.get(
    '/plan/create/:id/personal-interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/personal-interests/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getCiagPlanByIdResolver(services.ciagService),
      parseCheckBoxValue('personalInterests'),
    ],
    controller.post,
  )
}