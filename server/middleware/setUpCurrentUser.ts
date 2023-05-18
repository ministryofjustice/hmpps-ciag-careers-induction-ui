import { Router } from 'express'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'
import populateCurrentUser from './populateCurrentUser'
import type { Services } from '../services'
import populateUserActiveCaseLoad from './populateUserActiveCaseLoad'

export default function setUpCurrentUser({ userService, prisonerSearchService }: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(auth.authenticationMiddleware(tokenVerifier))
  router.use(populateCurrentUser(userService))
  router.use(populateUserActiveCaseLoad(prisonerSearchService))
  return router
}
