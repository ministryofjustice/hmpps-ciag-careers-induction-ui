import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import SkillsController from './skillsController'

export default (router: Router, services: Services) => {
  const controller = new SkillsController(services.inductionService)

  router.get('/plan/create/:id/skills/:mode', [getPrisonerByIdResolver(services.prisonerSearchService)], controller.get)
  router.post(
    '/plan/create/:id/skills/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), parseCheckBoxValue('skills')],
    controller.post,
  )
}
