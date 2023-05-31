import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import EducationLevelController from './educationLevelController'

export default (router: Router, services: Services) => {
  const controller = new EducationLevelController()

  router.get(
    '/profile/create/:id/job-of-particular-interest/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post('/profile/create/:id/job-of-particular-interest/:mode', controller.post)
}
