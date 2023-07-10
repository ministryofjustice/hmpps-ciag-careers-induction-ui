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
import typeOfWorkExperienceRoutes from './createPlan/typeOfWorkExperience'
import workDetailsRoutes from './createPlan/workDetails'
import workInterestsRoutes from './createPlan/workInterests'
import particularInterestsRoutes from './createPlan/particularInterests'

export default function routes(services: Services): Router {
  // Append page routes

  const router = Router()

  ciagListRoutes(router, services)
  workPlanRoutes(router, services)
  hopingToGetWorkRoutes(router, services)
  qualificationsRoutes(router, services)
  educationLevelRoutes(router, services)
  qualificationLevelRoutes(router, services)
  qualificationDetailsRoutes(router, services)
  otherQualificationsRoutes(router, services)
  hasWorkedBeforeRoutes(router, services)
  typeOfWorkExperienceRoutes(router, services)
  workDetailsRoutes(router, services)
  workInterestsRoutes(router, services)
  particularInterestsRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
