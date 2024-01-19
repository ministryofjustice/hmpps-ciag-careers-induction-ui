/* eslint-disable @typescript-eslint/no-explicit-any */
import PrisonerSearchClient from './prisonerSearchClient'
import LegacyRestClient from '../legacyRestClient'
import config from '../../config'

jest.mock('../legacyRestClient')

describe('PrisonerSearchClient', () => {
  let client: PrisonerSearchClient
  let restClientMock: jest.Mocked<LegacyRestClient>
  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new LegacyRestClient(
      'Prisoner Search',
      config.apis.prisonerSearch,
      'token',
    ) as jest.Mocked<LegacyRestClient>
    ;(LegacyRestClient as any).mockImplementation(() => restClientMock)
    client = new PrisonerSearchClient('token')
  })

  describe('#getPrisonerById', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/prisoner/${offenderNo}`
      const expectedResult: any = {
        prisonerNumber: offenderNo,
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getPrisonerById(offenderNo)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
