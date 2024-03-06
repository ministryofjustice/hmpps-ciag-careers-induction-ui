import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import QualificationDetailsController from './qualificationDetailsController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new QualificationDetailsController(services.inductionService)

  router.get(
    '/plan/create/:id/qualification-details/:qualificationId/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/qualification-details/:qualificationId/:mode',
    [checkSessionPageData('qualificationDetails'), getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
