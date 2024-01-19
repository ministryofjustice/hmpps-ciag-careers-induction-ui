import type { ClientContext, OauthApiClient } from '../oauthEnabledClient'
import { LearnerLatestAssessment, LearnerProfile } from './types/Types'

export default class CuriousApi {
  static create(client: OauthApiClient): CuriousApi {
    return new CuriousApi(client)
  }

  constructor(private readonly client: OauthApiClient) {}

  async getLearnerLatestAssessments(context: ClientContext, id: string): Promise<LearnerLatestAssessment[]> {
    const response = await this.client.get<LearnerProfile[]>(context, `/latestLearnerAssessments/${id}`)
    return response.body
  }
}
