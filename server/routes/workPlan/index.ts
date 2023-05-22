import type { Router } from 'express'

import { Services } from '../../services'
import WorkPlanController from './workPlanController'
import getPrisonerByIdResolver from '../../middleware/resolvers/getPrisonerByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new WorkPlanController()

  router.get('/plan/:id/view/:tab', [getPrisonerByIdResolver(services.prisonerSearchService)], controller.get)
}
