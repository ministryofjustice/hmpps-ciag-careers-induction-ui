import HmppsAuthClient from '../data/hmppsAuthClient'
import CommunityApiClient from '../data/communityApi/communityApiClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'

export default class CommunityService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getComForOffender(
    username: string,
    id: string,
  ): Promise<{ firstName: string; lastName: string; email: string } | undefined> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Get community manager
    const communityManagersResult = await new CommunityApiClient(systemToken).getAllOffenderManagers(id)
    const com = (communityManagersResult || []).find(
      p => p.isUnallocated === false && p.isPrisonOffenderManager === false,
    )

    // Return if none found
    if (!com) return undefined

    // Get staff details
    const staffDetails = await new NomisUserRolesApiClient(systemToken).getStaffDetails(com.staffId)

    return staffDetails
      ? {
          firstName: staffDetails.firstName,
          lastName: staffDetails.lastName,
          email: staffDetails.primaryEmail,
        }
      : {
          firstName: com.staff.forenames.split(' ')[0],
          lastName: com.staff.surname,
          email: '',
        }
  }
}
