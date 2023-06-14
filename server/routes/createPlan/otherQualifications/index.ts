import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import OtherQualificationsController from './otherQualificationsController'

export default (router: Router, services: Services) => {
  const controller = new OtherQualificationsController()

  router.get(
    '/plan/create/:id/other-qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/other-qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('otherQualifications')],
    controller.post,
  )
}
