import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import type { Services } from '../../../services'
import NotHopingToGetWorkController from './notHopingToGetWorkController'

export default (router: Router, services: Services) => {
  const controller = new NotHopingToGetWorkController()

  router.get(
    '/plan/create/:id/not-hoping-to-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/not-hoping-to-get-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('notHopingToGetWork')],
    controller.post,
  )
}
