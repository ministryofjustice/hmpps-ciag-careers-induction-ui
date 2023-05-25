import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import QualificationsController from './qualificationsController'
import getLatestAssessmentResolver from '../../../middleware/resolvers/getLatestAssessmentResolver'

export default (router: Router, services: Services) => {
  const controller = new QualificationsController()

  router.get(
    '/plan/create/:id/qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getLatestAssessmentResolver(services.curiousEsweService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
