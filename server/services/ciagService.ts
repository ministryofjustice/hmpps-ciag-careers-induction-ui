import type HmppsAuthClient from '../data/hmppsAuthClient'
import GetCiagPlanResponse from '../data/ciagApi/getCiagPlanResponse'
import CiagApiClient from '../data/ciagApi/ciagApiClient'

export default class CiagService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getPlan(currentUserName: string, offenderId: string): Promise<GetCiagPlanResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(currentUserName)

    const plan = await new CiagApiClient(systemToken).getCiagPlan(offenderId)
    return plan
  }
}
