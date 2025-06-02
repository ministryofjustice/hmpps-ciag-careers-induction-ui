/* eslint-disable @typescript-eslint/no-explicit-any */
import UserService from './userService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import ManageUsersApiClient, { User } from '../data/manageUsersApi/manageUsersApiClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/manageUsersApi/manageUsersApiClient')

const token = 'some token'

describe('User service', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let manageUsersApiClientMock: jest.Mocked<ManageUsersApiClient>
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      hmppsAuthClientMock = {
        getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
      } as unknown as jest.Mocked<HmppsAuthClient>
      ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

      manageUsersApiClientMock = {
        getUser: jest.fn(),
      } as unknown as jest.Mocked<ManageUsersApiClient>
      ;(ManageUsersApiClient as any).mockImplementation(() => manageUsersApiClientMock)

      userService = new UserService(hmppsAuthClientMock)
    })
    it('Retrieves and formats user name', async () => {
      manageUsersApiClientMock.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
    })
    it('Propagates error', async () => {
      manageUsersApiClientMock.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
  describe('getUserByUsername', () => {
    beforeEach(() => {
      hmppsAuthClientMock = {
        getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
      } as unknown as jest.Mocked<HmppsAuthClient>
      ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

      manageUsersApiClientMock = {
        getUserByUsername: jest.fn(),
      } as unknown as jest.Mocked<ManageUsersApiClient>
      ;(ManageUsersApiClient as any).mockImplementation(() => manageUsersApiClientMock)

      userService = new UserService(hmppsAuthClientMock)
    })
    it('Retrieves and formats user name', async () => {
      manageUsersApiClientMock.getUserByUsername.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUserByUsername(token, 'JOHNSMITH')

      expect(result.displayName).toEqual('John Smith')
    })
    it('Propagates error', async () => {
      manageUsersApiClientMock.getUserByUsername.mockRejectedValue(new Error('some error'))

      await expect(userService.getUserByUsername(token, 'JOHNSMITH')).rejects.toEqual(new Error('some error'))
    })
  })
})
