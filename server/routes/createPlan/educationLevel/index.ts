import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import EducationLevelController from './educationLevelController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new EducationLevelController(services.inductionService)

  router.get(
    '/plan/create/:id/education-level/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/education-level/:mode',
    [checkSessionPageData('educationLevel'), getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
