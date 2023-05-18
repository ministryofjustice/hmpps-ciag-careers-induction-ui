import { convertToTitleCase } from '../utils/utils'
import type HmppsAuthClient from '../data/hmppsAuthClient'

export interface UserDetails {
  name: string
  displayName: string
  username: string
}

export default class UserService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsAuthClient.getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name), username: user.name }
  }

  async getUserByUsername(currentUserName: string, username: string): Promise<UserDetails> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(currentUserName)

    const user = await this.hmppsAuthClient.getUserByUsername(systemToken, username)
    return { ...user, displayName: convertToTitleCase(user.name), username: user.name }
  }
}
