import config from '../../config'
import RestClient from '../restClient'
import logger from '../../../logger'

export interface User {
  name: string
  activeCaseLoadId: string
}

export interface UserRole {
  roleCode: string
}

export default class ManageUsersApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Manage users API', config.apis.manageUsersApi, token)
  }

  getUser(token: string): Promise<User> {
    logger.info(`Getting user details: calling Manage users API`)
    return ManageUsersApiClient.restClient(token).get({ path: '/users/me' }) as Promise<User>
  }

  getUserRoles(token: string): Promise<string[]> {
    return ManageUsersApiClient.restClient(token)
      .get({ path: '/users/me/roles' })
      .then(roles => (<UserRole[]>roles).map(role => role.roleCode))
  }

  getUserByUsername(token: string, username: string): Promise<User> {
    logger.info(`Getting user details: calling Manage users API`)
    return ManageUsersApiClient.restClient(token).get({ path: `/users/${username}` }) as Promise<User>
  }
}
