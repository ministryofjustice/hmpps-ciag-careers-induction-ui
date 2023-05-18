import { RequestHandler } from 'express'
import logger from '../log'
// eslint-disable-next-line import/no-named-as-default,import/no-named-as-default-member
import UserService from '../services/userService'
import getSanitisedError from '../sanitisedError'

export default function populateUserDetails(userService: UserService): RequestHandler {
  return async (req, res, next) => {
    // Already populated in session?
    if (res.locals?.user?.userDetails) {
      return next()
    }

    try {
      const { username } = res.locals.user
      const userDetails = await userService.getUser(username)
      if (userDetails) {
        res.locals.user.userDetails = userDetails
        return next()
      }

      // userDetails not defined
      logger.info(`User details could not be retrieved`)
      return res.redirect('/autherror')
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error obtaining user details')
      return next(error)
    }
  }
}
