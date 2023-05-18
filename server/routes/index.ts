/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express'
import type { Services } from '../services'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })

  // Append page routes

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
