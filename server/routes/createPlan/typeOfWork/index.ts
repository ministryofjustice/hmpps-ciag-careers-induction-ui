import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import TypeOfWorkController from './typeOfWorkController'

export default (router: Router, services: Services) => {
  const controller = new TypeOfWorkController()

  router.get(
    '/plan/create/:id/type-of-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/type-of-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('typeOfWork')],
    controller.post,
  )
}
