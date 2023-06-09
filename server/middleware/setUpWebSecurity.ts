import crypto from 'crypto'
import express, { Router, Request, Response } from 'express'
import helmet from 'helmet'
import config from '../config'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })
  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          formAction: ["'self'", new URL(config.apis.hmppsAuth.url).hostname],
          // Hash allows inline script pulled in from https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/template.njk
          scriptSrc: [
            "'self'",
            '*.google-analytics.com',
            '*.googletagmanager.com',
            (req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
          ],
          styleSrc: ["'self'", 'code.jquery.com', "'unsafe-inline'"],
          fontSrc: ["'self'"],
          connectSrc: ['*.google-analytics.com', '*.googletagmanager.com', '*.analytics.google.com'],
          imgSrc: ["'self'", '*.google-analytics.com', '*.googletagmanager.com'],
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  )

  // cf. https://security-guidance.service.justice.gov.uk/implement-security-txt/
  router.get('/.well-known/security.txt', (req, res) =>
    res.redirect(301, 'https://security-guidance.service.justice.gov.uk/.well-known/security.txt'),
  )

  return router
}
