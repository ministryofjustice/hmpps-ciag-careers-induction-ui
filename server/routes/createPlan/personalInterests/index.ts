import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import PersonalInterestsController from './personalInterestsController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new PersonalInterestsController(services.ciagService, services.inductionService)

  router.get(
    '/plan/create/:id/personal-interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/personal-interests/:mode',
    [
      checkSessionPageData('personalInterests'),
      getPrisonerByIdResolver(services.prisonerSearchService),
      parseCheckBoxValue('personalInterests'),
    ],
    controller.post,
  )
}
