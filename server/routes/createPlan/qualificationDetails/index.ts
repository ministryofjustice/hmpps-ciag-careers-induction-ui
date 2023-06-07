import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import QualificationDetailsController from './qualificationDetailsController'

export default (router: Router, services: Services) => {
  const controller = new QualificationDetailsController()

  router.get(
    '/plan/create/:id/qualification-details/:qualificationId/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post('/plan/create/:id/qualification-details/:qualificationId/:mode', controller.post)
}
