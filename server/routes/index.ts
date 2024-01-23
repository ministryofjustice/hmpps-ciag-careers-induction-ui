import { Router } from 'express'
import type { Services } from '../services'
import hopingToGetWorkRoutes from './createPlan/hopingToGetWork'
import qualificationsRoutes from './createPlan/qualifications'
import educationLevelRoutes from './createPlan/educationLevel'
import qualificationLevelRoutes from './createPlan/qualificationLevel'
import qualificationDetailsRoutes from './createPlan/qualificationDetails'
import additionalTrainingRoutes from './createPlan/additionalTraining'
import hasWorkedBeforeRoutes from './createPlan/hasWorkedBefore'
import typeOfWorkExperienceRoutes from './createPlan/typeOfWorkExperience'
import workDetailsRoutes from './createPlan/workDetails'
import workInterestsRoutes from './createPlan/workInterests'
import particularJobInterestsRoutes from './createPlan/particularJobInterests'
import skillsRoutes from './createPlan/skills'
import personalInterestsRoutes from './createPlan/personalInterests'
import abilityToWorkRoutes from './createPlan/abilityToWork'
import inPrisonWorkRoutes from './createPlan/inPrisonWork'
import inPrisonEducationRoutes from './createPlan/inPrisonEducation'
import checkYourAnswersRoutes from './createPlan/checkYourAnswers'
import reasonToNotGetWorkRoutes from './createPlan/reasonToNotGetWork'
import wantsToAddQualifications from './createPlan/wantsToAddQualifications'
import config from '../config'
import retrieveInduction from './routerRequestHandlers'

export default function routes(services: Services): Router {
  // Append page routes

  const router = Router()

  // Redirect the root route to PLP UI's root (Prisoner List Page)
  router.get('/', (req, res, next) => {
    res.redirect(config.learningPlanUrl)
  })

  router.get('/plan/create/:id/**/update', [retrieveInduction(services.ciagService)])
  router.post('/plan/create/:id/**/update', [retrieveInduction(services.ciagService)])

  checkYourAnswersRoutes(router, services)
  hopingToGetWorkRoutes(router, services)
  qualificationsRoutes(router, services)
  educationLevelRoutes(router, services)
  qualificationLevelRoutes(router, services)
  qualificationDetailsRoutes(router, services)
  additionalTrainingRoutes(router, services)
  hasWorkedBeforeRoutes(router, services)
  typeOfWorkExperienceRoutes(router, services)
  workDetailsRoutes(router, services)
  workInterestsRoutes(router, services)
  particularJobInterestsRoutes(router, services)
  skillsRoutes(router, services)
  personalInterestsRoutes(router, services)
  abilityToWorkRoutes(router, services)
  inPrisonWorkRoutes(router, services)
  inPrisonEducationRoutes(router, services)
  reasonToNotGetWorkRoutes(router, services)
  wantsToAddQualifications(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
