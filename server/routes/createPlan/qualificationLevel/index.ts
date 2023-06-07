import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import QualificationLevelController from './qualificationLevelController'

export default (router: Router, services: Services) => {
  const controller = new QualificationLevelController()

  router.get(
    '/plan/create/:id/qualification-level/:qualificationId/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post('/plan/create/:id/qualification-level/:qualificationId/:mode', controller.post)
}
