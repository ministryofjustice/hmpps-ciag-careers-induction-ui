/* eslint-disable @typescript-eslint/no-explicit-any */
import LegacyRestClient from '../legacyRestClient'
import config from '../../config'
import ManageUsersApiClient from './manageUsersApiClient'

const user = {
  username: 'MOCK_NAME',
}

jest.mock('../legacyRestClient')

describe('ManageUsersApiClient', () => {
  let manageUsersApiClientMock: ManageUsersApiClient
  let restClientMock: jest.Mocked<LegacyRestClient>

  beforeEach(() => {
    restClientMock = new LegacyRestClient(
      'Manage Users Api',
      config.apis.manageUsersApi,
      'token',
    ) as jest.Mocked<LegacyRestClient>
    ;(LegacyRestClient as any).mockImplementation(() => restClientMock)

    manageUsersApiClientMock = new ManageUsersApiClient()

    jest.clearAllMocks()
  })

  describe('#getUser', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedResult: any = {
        name: 'mock_user',
        activeCaseLoadId: 'mock_caseLoad',
      }

      restClientMock.get.mockResolvedValue(expectedResult)
      const result = await manageUsersApiClientMock.getUser('token')

      expect(result).toEqual(expectedResult)
    })
  })

  describe('#getUserRoles', () => {
    it('should make a GET request to the correct endpoint in order to retrieve user roles', async () => {
      const expectedPath = '/users/me/roles'
      const expectedResult: any = [
        {
          roleCode: 'MOCK_ROLE_1',
        },
        {
          roleCode: 'MOCK_ROLE_2',
        },
      ]

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await manageUsersApiClientMock.getUserRoles(user.username)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(['MOCK_ROLE_1', 'MOCK_ROLE_2'])
    })
  })

  describe('#getUserName', () => {
    it('should make a GET request to the correct endpoint in order to retrieve user name', async () => {
      const expectedPath = `/users/${user.username}`
      const expectedResult: any = {
        name: 'mock_user',
        activeCaseLoadId: 'mock_caseLoad',
      }

      restClientMock.get.mockResolvedValue(expectedResult)
      const result = await manageUsersApiClientMock.getUserByUsername('token', user.username)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
