import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import TypeOfWorkExperienceController from './typeOfWorkExperienceController'

export default (router: Router, services: Services) => {
  const controller = new TypeOfWorkExperienceController()

  router.get(
    '/plan/create/:id/type-of-work-experience/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/type-of-work-experience/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('typeOfWorkExperience')],
    controller.post,
  )
}
