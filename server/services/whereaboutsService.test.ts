import HmppsAuthClient from '../data/hmppsAuthClient'
import WhereaboutsApiClient from '../data/whereaboutsApi/whereaboutsApiClient'
import GetUnacceptibleAbsenceCountResult from '../data/whereaboutsApi/getUnacceptibleAbsenceCountResult'
import WhereaboutsService from './whereaboutsService'

jest.mock('../data/whereaboutsApi/whereaboutsApiClient')

describe('WhereaboutsService', () => {
  let hmppsAuthClient: HmppsAuthClient
  let whereaboutsService: WhereaboutsService

  beforeEach(() => {
    hmppsAuthClient = {
      getSystemClientToken: jest.fn().mockResolvedValue('system-token'),
    } as unknown as HmppsAuthClient
    whereaboutsService = new WhereaboutsService(hmppsAuthClient)
  })

  describe('getUnacceptibleAbsenceCount', () => {
    it('calls WhereaboutsApiClient with correct parameters', async () => {
      const id = '123'
      const startDate = new Date('2022-01-01')
      const endDate = new Date('2022-01-31')

      const expectedUnacceptableAbsenceCountResult = {
        acceptableAbsence: 5,
        unacceptableAbsence: 2,
        total: 7,
      } as GetUnacceptibleAbsenceCountResult

      const whereAboutsApiClientMock = jest.fn().mockImplementation(() => {
        return {
          getUnacceptibleAbsenceCount: jest.fn().mockResolvedValue(expectedUnacceptableAbsenceCountResult),
        }
      })
      ;(WhereaboutsApiClient as jest.Mock).mockImplementation(whereAboutsApiClientMock)

      const result = await whereaboutsService.getUnacceptibleAbsenceCount('current-username', id, startDate, endDate)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith('current-username')
      expect(whereAboutsApiClientMock).toHaveBeenCalledWith('system-token')
      expect(result).toEqual(expectedUnacceptableAbsenceCountResult)
    })
  })
})
