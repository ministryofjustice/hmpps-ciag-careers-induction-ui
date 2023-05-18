/* eslint-disable @typescript-eslint/no-explicit-any */
import CommunityApiClient from './communityApiClient'
import RestClient from '../restClient'
import config from '../../config'

jest.mock('../restClient')

describe('CommunityApiClient', () => {
  let client: CommunityApiClient
  let restClientMock: jest.Mocked<RestClient>

  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient('Community API', config.apis.communityApi, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new CommunityApiClient('token')
  })

  describe('getAllOffenderManagers', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/secure/offenders/crn/${offenderNo}/allOffenderManagers?includeProbationAreaTeams=true`
      const expectedResult: any = {
        data: 'mock_data',
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getAllOffenderManagers(offenderNo)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
