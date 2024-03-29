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

  const scriptSrc = [
    "'self'",
    '*.google-analytics.com',
    '*.googletagmanager.com',
    (req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
  ]
  const styleSrc = ["'self'", 'code.jquery.com', "'unsafe-inline'"]
  const imgSrc = ["'self'", 'data:']
  const fontSrc = ["'self'"]
  const connectSrc = ['*.google-analytics.com', '*.googletagmanager.com', '*.analytics.google.com']

  if (config.apis.frontendComponents.url) {
    scriptSrc.push(config.apis.frontendComponents.url)
    styleSrc.push(config.apis.frontendComponents.url)
    imgSrc.push(config.apis.frontendComponents.url)
    fontSrc.push(config.apis.frontendComponents.url)
  }

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          formAction: [`'self' ${config.apis.hmppsAuth.externalUrl} ${config.dpsHomeUrl} ${config.learningPlanUrl}`],
          scriptSrc,
          styleSrc,
          fontSrc,
          imgSrc,
          connectSrc,
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
