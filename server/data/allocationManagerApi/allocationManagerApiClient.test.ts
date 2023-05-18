/* eslint-disable @typescript-eslint/no-explicit-any */
import AllocationManagerApiClient from './allocationManagerApiClient'
import RestClient from '../restClient'
import config from '../../config'

jest.mock('../restClient')

describe('AllocationManagerApiClient', () => {
  let client: AllocationManagerApiClient
  let restClientMock: jest.Mocked<RestClient>

  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient(
      'Community API',
      config.apis.allocationManagerApi,
      'token',
    ) as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new AllocationManagerApiClient('token')
  })

  describe('getPomForOffender', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/api/allocation/${offenderNo}`
      const expectedResult: any = {
        data: 'mock_data',
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getPomForOffender(offenderNo)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
