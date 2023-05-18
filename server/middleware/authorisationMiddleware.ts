import jwtDecode from 'jwt-decode'
import type { RequestHandler } from 'express'

import logger from '../../logger'
import asyncMiddleware from './asyncMiddleware'

export enum AuthRole {
  ROLE_VIEW_PRISONER_DATA = 'ROLE_VIEW_PRISONER_DATA',
}

export const isAuthorisedRole = (role: string): boolean =>
  Object.keys(AuthRole)
    .map(key => AuthRole[key])
    .includes(role)

export default function authorisationMiddleware(authorisedRoles: string[] = []): RequestHandler {
  return asyncMiddleware((req, res, next) => {
    if (res.locals && res.locals.user && res.locals.user.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      if (authorisedRoles.length && !roles.some(role => authorisedRoles.includes(role))) {
        logger.error('User is not authorised to access this')
        return res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  })
}
