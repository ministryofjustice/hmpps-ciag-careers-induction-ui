import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import AddQualificationsLiteController from './addQualificationsLiteController'
import getLatestAssessmentResolver from '../../../middleware/resolvers/getLatestAssessmentResolver'

export default (router: Router, services: Services) => {
  const controller = new AddQualificationsLiteController()

  router.get(
    '/plan/create/:id/add-qualifications-lite/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getLatestAssessmentResolver(services.curiousEsweService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/add-qualifications-lite/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
