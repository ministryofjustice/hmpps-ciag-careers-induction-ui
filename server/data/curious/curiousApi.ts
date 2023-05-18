import type { ClientContext, OauthApiClient } from '../oauthEnabledClient'
// eslint-disable-next-line import/named
import { mapToQueryString } from '../../utils/utils'
import {
  LearnerGoals,
  LearnerLatestAssessment,
  LearnerProfile,
  LearnerEducation,
  LearnerEmployabilitySkills,
  PageLearnerEducation,
  PageLearnerEmployabilitySkills,
  LearnerNeurodivergence,
} from './types/Types'

export default class CuriousApi {
  static create(client: OauthApiClient): CuriousApi {
    return new CuriousApi(client)
  }

  constructor(private readonly client: OauthApiClient) {}

  async getLearnerProfiles(context: ClientContext, id: string, establishmentId?: string): Promise<LearnerProfile[]> {
    const response = await this.client.get<LearnerProfile[]>(
      context,
      this.applyQuery(`/learnerProfile/${id}`, { establishmentId }),
    )
    return response.body
  }

  async getLearnerEducation(
    context: ClientContext,
    id: string,
    sort?: string,
    isCurrent?: boolean,
    establishmentId?: string,
    page?: number,
    size?: number,
  ): Promise<PageLearnerEducation> {
    const response = await this.client.get<LearnerEducation>(
      context,
      this.applyQuery(`/learnerEducation/${id}`, {
        sort,
        isCurrent,
        establishmentId,
        page,
        size,
      }),
    )
    return response.body
  }

  async getLearnerEducationRaw(
    context: ClientContext,
    id: string,
    isCurrent?: boolean,
    establishmentId?: string,
  ): Promise<LearnerEducation> {
    const response = await this.client.get<LearnerEducation>(
      context,
      this.applyQuery(`/learnerEducation/${id}`, {
        isCurrent,
        establishmentId,
      }),
    )
    return response.body
  }

  async getLearnerLatestAssessments(context: ClientContext, id: string): Promise<LearnerLatestAssessment[]> {
    const response = await this.client.get<LearnerProfile[]>(context, `/latestLearnerAssessments/${id}`)
    return response.body
  }

  async getLearnerGoals(context: ClientContext, id: string): Promise<LearnerGoals> {
    const response = await this.client.get<LearnerGoals>(context, `/learnerGoals/${id}`)
    return response.body
  }

  async getLearnerEmployabilitySkillsRaw(context: ClientContext, id: string): Promise<LearnerEmployabilitySkills> {
    return this.client
      .get<LearnerEmployabilitySkills>(context, `/learnerEmployabilitySkills/${id}`)
      .then(response => response.body)
  }

  getLearnerEmployabilitySkills(context: ClientContext, id: string): Promise<PageLearnerEmployabilitySkills> {
    return this.client
      .get<LearnerEmployabilitySkills>(context, `/learnerEmployabilitySkills/${id}?size=10000`)
      .then(response => response.body)
  }

  async getLearnerNeurodivergence(
    context: ClientContext,
    id: string,
    establishmentId?: string,
  ): Promise<LearnerNeurodivergence[]> {
    const response = await this.client.get<LearnerNeurodivergence[]>(
      context,
      this.applyQuery(`/learnerNeurodivergence/${id}`, { establishmentId }),
    )
    return response.body
  }

  private applyQuery = (path: string, query?: Record<string, unknown>) => {
    const queries = mapToQueryString(query)
    return this.hasNonEmptyValues(query) ? `${path}?${queries}` : path
  }

  private hasNonEmptyValues = (object?: Record<string, unknown>) =>
    object && Object.values(object).filter(value => !!value).length > 0
}
