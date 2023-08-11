import type HmppsAuthClient from '../data/hmppsAuthClient'
import CiagPlan from '../data/ciagApi/interfaces/ciagPlan'
import CiagApiClient from '../data/ciagApi/ciagApiClient'

export default class CiagService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getPlan(currentUserName: string, offenderId: string): Promise<CiagPlan> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(currentUserName)

    const plan = await new CiagApiClient(systemToken).getCiagPlan(offenderId)
    return plan
  }
}
