import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import InterestsController from './interestsController'

export default (router: Router, services: Services) => {
  const controller = new InterestsController()

  router.get(
    '/plan/create/:id/interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('interests')],
    controller.post,
  )
}
