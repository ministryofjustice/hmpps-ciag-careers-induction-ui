/* eslint-disable @typescript-eslint/no-explicit-any */
import KeyworkerApiClient from '../data/keyworkerApi/keyworkerApiClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import KeyworkerService from './keyworkerService'
import HmppsAuthClient from '../data/hmppsAuthClient'

jest.mock('../data/keyworkerApi/keyworkerApiClient')
jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')
jest.mock('../data/hmppsAuthClient')

describe('KeyworkerService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let keyworkerApiClientMock: jest.Mocked<KeyworkerApiClient>
  let nomisUserRolesApiClientMock: jest.Mocked<NomisUserRolesApiClient>
  let keyworkerService: KeyworkerService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    keyworkerApiClientMock = {
      getKeyworkerForOffender: jest.fn().mockResolvedValue({ staffId: '123' }),
    } as unknown as jest.Mocked<KeyworkerApiClient>
    ;(KeyworkerApiClient as any).mockImplementation(() => keyworkerApiClientMock)

    nomisUserRolesApiClientMock = {
      getStaffDetails: jest
        .fn()
        .mockResolvedValue({ firstName: 'John', lastName: 'Doe', primaryEmail: 'john.doe@nomis.com' }),
    } as unknown as jest.Mocked<NomisUserRolesApiClient>
    ;(NomisUserRolesApiClient as any).mockImplementation(() => nomisUserRolesApiClientMock)

    keyworkerService = new KeyworkerService(hmppsAuthClientMock)
  })

  it('should return the keyworker details for the given offender', async () => {
    const result = await keyworkerService.getKeyworkerForOffender('user', 'offender')

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@nomis.com',
    })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(keyworkerApiClientMock.getKeyworkerForOffender).toHaveBeenCalledWith('offender')
    expect(nomisUserRolesApiClientMock.getStaffDetails).toHaveBeenCalledWith('123')
  })
})
