import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import TypeOfWorkExperienceController from './typeOfWorkExperienceController'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

export default (router: Router, services: Services) => {
  const controller = new TypeOfWorkExperienceController(services.ciagService, services.inductionService)

  router.get(
    '/plan/create/:id/type-of-work-experience/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/type-of-work-experience/:mode',
    [
      checkSessionPageData('typeOfWorkExperience'),
      getPrisonerByIdResolver(services.prisonerSearchService),
      parseCheckBoxValue('typeOfWorkExperience'),
    ],
    controller.post,
  )
}
