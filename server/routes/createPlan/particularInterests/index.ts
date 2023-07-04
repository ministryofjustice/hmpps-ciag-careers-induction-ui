import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import ParticularInterestsController from './particularInterestsController'

export default (router: Router, services: Services) => {
  const controller = new ParticularInterestsController()

  router.get(
    '/plan/create/:id/particular-interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/particular-interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('particularInterests')],
    controller.post,
  )
}
