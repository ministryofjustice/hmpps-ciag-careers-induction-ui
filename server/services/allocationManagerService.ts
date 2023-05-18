import HmppsAuthClient from '../data/hmppsAuthClient'
import AllocationManagerApiClient from '../data/allocationManagerApi/allocationManagerApiClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'

export default class AllocationManagerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getPomForOffender(
    username: string,
    id: string,
  ): Promise<{ firstName: string; lastName: string; email: string }> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    const pomResult = await new AllocationManagerApiClient(systemToken).getPomForOffender(id)
    const staffDetails = await new NomisUserRolesApiClient(systemToken).getStaffDetails(pomResult.primary_pom.staff_id)

    return {
      firstName: staffDetails.firstName,
      lastName: staffDetails.lastName,
      email: staffDetails.primaryEmail,
    }
  }
}
