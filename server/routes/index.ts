/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import type { Services } from '../services'
import ciagListRoutes from './ciagList'
import workPlanRoutes from './workPlan'
import hopingToGetWorkRoutes from './createPlan/hopingToGetWork'
import qualificationsRoutes from './createPlan/qualifications'
import educationLevelRoutes from './createPlan/educationLevel'
import qualificationLevelRoutes from './createPlan/qualificationLevel'
import qualificationDetailsRoutes from './createPlan/qualificationDetails'
import otherQualificationsRoutes from './createPlan/otherQualifications'
import hasWorkedBeforeRoutes from './createPlan/hasWorkedBefore'
import typeOfWorkRoutes from './createPlan/typeOfWork'

export default function routes(services: Services): Router {
  // Append page routes

  const router = Router()

  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })

  ciagListRoutes(router, services)
  workPlanRoutes(router, services)
  hopingToGetWorkRoutes(router, services)
  qualificationsRoutes(router, services)
  educationLevelRoutes(router, services)
  qualificationLevelRoutes(router, services)
  qualificationDetailsRoutes(router, services)
  otherQualificationsRoutes(router, services)
  hasWorkedBeforeRoutes(router, services)
  typeOfWorkRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
