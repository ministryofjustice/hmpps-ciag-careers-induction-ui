import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import ParticularJobInterestsController from './particularJobInterestsController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new ParticularJobInterestsController(services.inductionService)

  router.get(
    '/plan/create/:id/particular-job-interests/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/particular-job-interests/:mode',
    [
      checkSessionPageData('particularJobInterests'),
      getPrisonerByIdResolver(services.prisonerSearchService),
      parseCheckBoxValue('particularJobInterests'),
    ],
    controller.post,
  )
}
