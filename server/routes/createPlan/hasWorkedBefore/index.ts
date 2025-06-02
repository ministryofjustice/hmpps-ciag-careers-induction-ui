import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import HasWorkedBeforeController from './hasWorkedBeforeController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new HasWorkedBeforeController(services.inductionService)

  router.get(
    '/plan/create/:id/has-worked-before/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/has-worked-before/:mode',
    [checkSessionPageData('hasWorkedBefore'), getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
