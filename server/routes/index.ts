/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import type { Services } from '../services'
import workPlanRoutes from './workPlan'

export default function routes(services: Services): Router {
  // Append page routes

  const router = Router()

  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })

  workPlanRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
