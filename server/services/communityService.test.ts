/* eslint-disable @typescript-eslint/no-explicit-any */
import CommunityApiClient from '../data/communityApi/communityApiClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import CommunityService from './communityService'

jest.mock('../data/communityApi/communityApiClient')
jest.mock('../data/hmppsAuthClient')
jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')

describe('CommunityService', () => {
  let communityService: CommunityService
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let communityApiClient: jest.Mocked<CommunityApiClient>
  let nomisUserRolesApiClient: jest.Mocked<NomisUserRolesApiClient>

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient({} as any) as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClient)

    communityApiClient = new CommunityApiClient({} as any) as jest.Mocked<CommunityApiClient>
    ;(CommunityApiClient as any).mockImplementation(() => communityApiClient)

    nomisUserRolesApiClient = new NomisUserRolesApiClient({} as any) as jest.Mocked<NomisUserRolesApiClient>
    ;(NomisUserRolesApiClient as any).mockImplementation(() => nomisUserRolesApiClient)

    communityService = new CommunityService(hmppsAuthClient)
  })

  describe('getComForOffender', () => {
    it('returns undefined if no community manager found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      communityApiClient.getAllOffenderManagers.mockResolvedValue([])

      const result = await communityService.getComForOffender(username, id)

      expect(result).toBeUndefined()
    })

    it('returns staff details if community manager found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'
      const staffDetails: any = {
        firstName: 'John',
        lastName: 'Doe',
        primaryEmail: 'john.doe@example.com',
        staffId: 456,
        status: 'mock_status',
        generalAccount: true,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      communityApiClient.getAllOffenderManagers.mockResolvedValue([
        {
          staffId: 456,
          isUnallocated: false,
          isPrisonOffenderManager: false,
        } as any,
      ])
      nomisUserRolesApiClient.getStaffDetails.mockResolvedValue(staffDetails)

      const result = await communityService.getComForOffender(username, id)

      expect(result).toEqual({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    it('returns fallback details if staff details not found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'
      const com = {
        staff: {
          forenames: 'Jane Mary',
          surname: 'Doe',
        },
        isUnallocated: false,
        isPrisonOffenderManager: false,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      communityApiClient.getAllOffenderManagers.mockResolvedValue([
        {
          staffId: 456,
          ...com,
        } as any,
      ])
      nomisUserRolesApiClient.getStaffDetails.mockResolvedValue(undefined)

      const result = await communityService.getComForOffender(username, id)

      expect(result).toEqual({
        firstName: 'Jane',
        lastName: 'Doe',
        email: '',
      })
    })
  })
})
