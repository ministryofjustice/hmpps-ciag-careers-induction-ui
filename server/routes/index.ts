/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import type { Services } from '../services'
import workPlanRoutes from './workPlan'
import ciagListRoutes from './ciagList'

export default function routes(services: Services): Router {
  const router = Router()

  // Append page routes
  ciagListRoutes(router, services)
  workPlanRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
