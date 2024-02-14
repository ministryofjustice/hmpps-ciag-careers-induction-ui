import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import WorkDetailsController from './workDetailsController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new WorkDetailsController(services.ciagService, services.inductionService)

  router.get(
    '/plan/create/:id/work-details/:typeOfWorkExperienceKey/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/work-details/:typeOfWorkExperienceKey/:mode',
    [checkSessionPageData('workDetails'), getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
