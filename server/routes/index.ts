/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import type { Services } from '../services'
import workPlanRoutes from './workPlan'
import hopingToGetWorkRoutes from './createPlan/hopingToGetWork'
import qualificationsRoutes from './createPlan/qualifications'
import educationLevelRoutes from './createPlan/educationLevel'
import qualificationLevel from './createPlan/qualificationLevel'
import qualificationDetails from './createPlan/qualificationDetails'

export default function routes(services: Services): Router {
  // Append page routes

  const router = Router()

  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })

  workPlanRoutes(router, services)
  hopingToGetWorkRoutes(router, services)
  qualificationsRoutes(router, services)
  educationLevelRoutes(router, services)
  qualificationLevel(router, services)
  qualificationDetails(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
