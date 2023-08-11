import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import FunctionalSkillsController from './functionalSkillsController'
import getLatestAssessmentResolver from '../../../middleware/resolvers/getLatestAssessmentResolver'

export default (router: Router, services: Services) => {
  const controller = new FunctionalSkillsController()

  router.get(
    '/plan/create/:id/functional-skills/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getLatestAssessmentResolver(services.curiousEsweService)],
    controller.get,
  )
  router.post(
    '/plan/create/:id/functional-skills/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
