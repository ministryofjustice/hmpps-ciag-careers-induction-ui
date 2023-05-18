/* eslint-disable @typescript-eslint/no-explicit-any */
import NomisUserRolesApiClient from './nomisUserRolesApiClient'
import RestClient from '../restClient'
import config from '../../config'

jest.mock('../restClient')

describe('NomisUserRolesApiClient', () => {
  let client: NomisUserRolesApiClient
  let restClientMock: jest.Mocked<RestClient>

  const staffId = 12345

  const user = {
    username: 'MOCK_NAME',
  }

  beforeEach(() => {
    restClientMock = new RestClient(
      'Nomis User Roles API',
      config.apis.nomisUserRolesApi,
      'token',
    ) as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new NomisUserRolesApiClient('token')

    jest.clearAllMocks()
  })

  describe('#getUserCaseLoads', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/users/${user.username}/caseloads`
      const expectedResult: any = {
        caseloads: [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ],
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getUserCaseLoads(user as any)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual([1, 2])
    })
  })

  describe('#getUserRoles', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/users/${user.username}/roles`
      const expectedResult: any = [
        {
          roleCode: 'MOCK_ROLE_1',
        },
        {
          roleCode: 'MOCK_ROLE_2',
        },
      ]

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getUserRoles(user.username)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(['ROLE_MOCK_ROLE_1', 'ROLE_MOCK_ROLE_2'])
    })
  })

  describe('#getUserActiveCaseLoad', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/me/caseloads`
      const expectedResult: any = {
        id: 1,
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getUserActiveCaseLoad()

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })

  describe('#getStaffDetails', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/users/staff/${staffId}`
      const expectedResult: any = {
        staffId,
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getStaffDetails(staffId)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
