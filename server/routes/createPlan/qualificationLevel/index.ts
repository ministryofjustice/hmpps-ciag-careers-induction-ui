import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import QualificationLevelController from './qualificationLevelController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new QualificationLevelController()

  router.get(
    '/plan/create/:id/qualification-level/:qualificationId/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/qualification-level/:qualificationId/:mode',
    [checkSessionPageData('qualificationLevel'), getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
