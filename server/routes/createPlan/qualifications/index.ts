import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import QualificationsController from './qualificationsController'
import getLatestAssessmentResolver from '../../../middleware/resolvers/getLatestAssessmentResolver'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new QualificationsController()

  router.get(
    '/plan/create/:id/qualifications-list/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getCiagPlanByIdResolver(services.ciagService),
      getLatestAssessmentResolver(services.curiousEsweService),
    ],
    controller.get,
  )
  router.post(
    '/plan/create/:id/qualifications-list/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.post,
  )
}
