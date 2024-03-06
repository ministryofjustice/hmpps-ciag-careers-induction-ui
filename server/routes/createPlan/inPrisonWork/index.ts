import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import InPrisonWorkController from './inPrisonWorkController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new InPrisonWorkController(services.inductionService)

  router.get(
    '/plan/create/:id/in-prison-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/in-prison-work/:mode',
    [
      checkSessionPageData('inPrisonWork'),
      getPrisonerByIdResolver(services.prisonerSearchService),
      parseCheckBoxValue('inPrisonWork'),
    ],
    controller.post,
  )
}
