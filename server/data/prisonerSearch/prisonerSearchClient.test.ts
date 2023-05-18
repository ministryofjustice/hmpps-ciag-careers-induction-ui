/* eslint-disable @typescript-eslint/no-explicit-any */
import PrisonerSearchClient from './prisonerSearchClient'
import RestClient from '../restClient'
import config from '../../config'

jest.mock('../restClient')

describe('PrisonerSearchClient', () => {
  let client: PrisonerSearchClient
  let restClientMock: jest.Mocked<RestClient>
  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient('Prisoner Search', config.apis.prisonerSearch, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new PrisonerSearchClient('token')
  })

  describe('#getPrisonersByReleaseDate', () => {
    it('should make a POST request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/prisoner-search/release-date-by-prison?page=0&size=${config.maximumNumberOfRecordsToReturn}`
      const expectedResult: any = [
        {
          prisonerNumber: offenderNo,
        },
      ]

      restClientMock.post.mockResolvedValue(expectedResult)

      const result = await client.getPrisonersByReleaseDate({ offenderNo } as any)

      expect(restClientMock.post).toHaveBeenCalledWith({
        path: expectedPath,
        data: {
          offenderNo: 'A1234BC',
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
