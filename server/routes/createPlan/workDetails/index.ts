import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import WorkDetailsController from './workDetailsController'

export default (router: Router, services: Services) => {
  const controller = new WorkDetailsController()

  router.get(
    '/plan/create/:id/work-details/:typeOfWorkKey/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post('/plan/create/:id/work-details/:typeOfWorkKey/:mode', controller.post)
}
