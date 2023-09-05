import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import WantsToAddQualificationsController from './wantsToAddQualificationsController'
import getLatestAssessmentResolver from '../../../middleware/resolvers/getLatestAssessmentResolver'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new WantsToAddQualificationsController()

  router.get(
    '/plan/create/:id/wants-to-add-qualifications/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getLatestAssessmentResolver(services.curiousEsweService),
      getCiagPlanByIdResolver(services.ciagService),
    ],
    controller.get,
  )
  router.post(
    '/plan/create/:id/wants-to-add-qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getCiagPlanByIdResolver(services.ciagService)],
    controller.post,
  )
}
