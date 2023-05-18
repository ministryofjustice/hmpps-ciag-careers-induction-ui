/* eslint-disable @typescript-eslint/no-explicit-any */
import KeyworkerApiClient from './keyworkerApiClient'
import RestClient from '../restClient'
import GetKeyworkerForOffenderResponse from './getKeyworkerForOffenderResponse'
import config from '../../config'

jest.mock('../restClient')

describe('KeyworkerApiClient', () => {
  let client: KeyworkerApiClient
  let restClientMock: jest.Mocked<RestClient>
  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient('Keyworker API', config.apis.keyworkerApi, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new KeyworkerApiClient('token')
  })

  describe('getKeyworkerForOffender', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/key-worker/offender/${offenderNo}`
      const expectedResult: GetKeyworkerForOffenderResponse = {
        staffId: 1234,
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getKeyworkerForOffender(offenderNo)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
