import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import type { Services } from '../../../services'
import ReasonToNotGetWorkController from './reasonToNotGetWorkController'

export default (router: Router, services: Services) => {
  const controller = new ReasonToNotGetWorkController()

  router.get(
    '/plan/create/:id/reason-to-not-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/reason-to-not-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('reasonToNotGetWork')],
    controller.post,
  )
}
