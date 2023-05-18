import HmppsAuthClient from '../data/hmppsAuthClient'
import KeyworkerApiClient from '../data/keyworkerApi/keyworkerApiClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'

export default class KeyworkerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getKeyworkerForOffender(
    username: string,
    id: string,
  ): Promise<{ firstName: string; lastName: string; email: string }> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    const keyworkerResult = await new KeyworkerApiClient(systemToken).getKeyworkerForOffender(id)
    const staffDetails = await new NomisUserRolesApiClient(systemToken).getStaffDetails(keyworkerResult.staffId)

    return {
      firstName: staffDetails.firstName,
      lastName: staffDetails.lastName,
      email: staffDetails.primaryEmail,
    }
  }
}
