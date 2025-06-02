import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import InPrisonEducationController from './inPrisonEducationController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new InPrisonEducationController(services.inductionService)

  router.get(
    '/plan/create/:id/in-prison-education/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/in-prison-education/:mode',
    [
      checkSessionPageData('inPrisonEducation'),
      getPrisonerByIdResolver(services.prisonerSearchService),
      parseCheckBoxValue('inPrisonEducation'),
    ],
    controller.post,
  )
}
