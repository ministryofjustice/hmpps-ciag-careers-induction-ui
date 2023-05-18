/* eslint-disable import/prefer-default-export */
import type { Request, Response } from 'express'

import { UserService } from '../../services'
import { getSessionData, setSessionData } from '../../utils/session'

export const getUserFullName = async (req: Request, res: Response, userService: UserService, userName: string) => {
  const { user } = res.locals

  try {
    let name = getSessionData(req, ['userNameCache', userName], '')
    if (!name) {
      const found = await userService.getUserByUsername(user.username, userName)
      name = found.name
      setSessionData(req, ['userNameCache', userName], found.name)
    }

    return name || userName
  } catch (err) {
    // handle no user account
    if (err?.data?.field === 'username') {
      return userName
    }

    throw err
  }
}
