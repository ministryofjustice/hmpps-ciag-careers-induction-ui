/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonApiClient from '../data/prisonApi/prisonApiClient'
import PrisonService from './prisonService'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonApi/prisonApiClient')

describe('PrisonService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let prisonApiClientMock: jest.Mocked<PrisonApiClient>
  let prisonService: PrisonService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    prisonApiClientMock = {
      getAllOffenderActivities: jest.fn().mockResolvedValue({ activities: [] }),
    } as unknown as jest.Mocked<PrisonApiClient>
    ;(PrisonApiClient as any).mockImplementation(() => prisonApiClientMock)

    prisonService = new PrisonService(hmppsAuthClientMock)
  })

  it('should return all offender activities for the given offender', async () => {
    const result = await prisonService.getAllOffenderActivities('user', 'offender')

    expect(result).toEqual({ activities: [] })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(prisonApiClientMock.getAllOffenderActivities).toHaveBeenCalledWith('offender')
  })
})
