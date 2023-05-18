/* eslint-disable @typescript-eslint/no-explicit-any */
import WhereaboutsApiClient from './whereaboutsApiClient'
import RestClient from '../restClient'
import GetUnacceptibleAbsenceCountResult from './getUnacceptibleAbsenceCountResult'
import config from '../../config'

jest.mock('../restClient')

describe('WhereaboutsApiClient', () => {
  let client: WhereaboutsApiClient
  let restClientMock: jest.Mocked<RestClient>

  const offenderNo = 'A1234BC'
  const startDate = new Date('2023-04-01')
  const endDate = new Date('2023-04-13')

  beforeEach(() => {
    restClientMock = new RestClient('Whereabouts API', config.apis.whereaboutsApi, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new WhereaboutsApiClient('token')
  })

  describe('getUnacceptibleAbsenceCount', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/attendances/offender/${offenderNo}/unacceptable-absence-count?fromDate=2023-04-01&toDate=2023-04-13`
      const expectedResult: GetUnacceptibleAbsenceCountResult = {
        acceptableAbsence: 2,
        unacceptableAbsence: 2,
        total: 4,
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getUnacceptibleAbsenceCount(offenderNo, startDate, endDate)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
