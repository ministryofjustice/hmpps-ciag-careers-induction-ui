/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import type { Services } from '../services'
import workPlanRoutes from './workPlan'
import ciagListRoutes from './ciagList'
import hopingToGetWorkRoutes from './createPlan/hopingToGetWork'
import qualificationsRoutes from './createPlan/qualifications'
import educationLevelRoutes from './createPlan/educationLevel'
import qualificationLevel from './createPlan/qualificationLevel'

export default function routes(services: Services): Router {
  // Append page routes

  const router = Router()

  // Append page routes
  ciagListRoutes(router, services)
  workPlanRoutes(router, services)
  hopingToGetWorkRoutes(router, services)
  qualificationsRoutes(router, services)
  educationLevelRoutes(router, services)
  qualificationLevel(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
