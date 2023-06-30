/* eslint-disable @typescript-eslint/no-explicit-any */
import PrisonerSearchClient from './prisonerSearchClient'
import RestClient from '../restClient'
import config from '../../config'

jest.mock('../restClient')

describe('PrisonerSearchClient', () => {
  let client: PrisonerSearchClient
  let restClientMock: jest.Mocked<RestClient>
  const offenderNo = 'A1234BC'
  const caseloadId = 'MDI'

  beforeEach(() => {
    restClientMock = new RestClient('Prisoner Search', config.apis.prisonerSearch, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new PrisonerSearchClient('token')
  })

  describe('#getPrisonersByCaseloadId', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/prisoner-search/prison/${caseloadId}?page=0&size=${config.maximumNumberOfRecordsToReturn}`
      const expectedResult: any = [
        {
          prisonerNumber: offenderNo,
        },
      ]

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getPrisonersByCaseloadId(caseloadId)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
        headers: {
          'content-type': 'application/json',
        },
      })
      expect(result).toEqual(expectedResult)
    })
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
