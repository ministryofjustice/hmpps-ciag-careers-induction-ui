/* eslint-disable @typescript-eslint/no-explicit-any */
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonerSearchService from './prisonSearchService'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonerSearch/prisonerSearchClient')
jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')

describe('PrisonSearchService', () => {
  let prisonerSearchClientMock: jest.Mocked<PrisonerSearchClient>
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let prisonSearchService: PrisonerSearchService

  const mockPrisoner = {
    prisonerNumber: 'AA1122',
    firstName: 'mock_name1',
    lastName: 'mock_name2',
  }

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    prisonerSearchClientMock = {
      getPrisonersByCaseloadId: jest.fn().mockResolvedValue(mockPrisoner),
    } as unknown as jest.Mocked<PrisonerSearchClient>
    ;(PrisonerSearchClient as any).mockImplementation(() => prisonerSearchClientMock)

    prisonSearchService = new PrisonerSearchService(hmppsAuthClientMock)
  })

  it('should return a list of prisoners based on a caseload', async () => {
    const result = await prisonSearchService.getPrisonersByCaseloadID('user', 'MDI')

    expect(result).toEqual(mockPrisoner)
    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
  })
})
