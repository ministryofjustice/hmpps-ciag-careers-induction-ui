import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import QualificationsController from './qualificationsController'

export default (router: Router, services: Services) => {
  const controller = new QualificationsController()

  router.get(
    '/plan/create/:id/qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
