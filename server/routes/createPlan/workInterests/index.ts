import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import WorkInterestsController from './workInterestsController'

export default (router: Router, services: Services) => {
  const controller = new WorkInterestsController()

  router.get(
    '/plan/create/:id/work-interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/work-interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('workInterests')],
    controller.post,
  )
}
