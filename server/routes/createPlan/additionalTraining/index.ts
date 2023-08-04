import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import AdditionalTrainingController from './additionalTrainingController'

export default (router: Router, services: Services) => {
  const controller = new AdditionalTrainingController()

  router.get(
    '/plan/create/:id/additional-training/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/additional-training/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('additionalTraining')],
    controller.post,
  )
}
