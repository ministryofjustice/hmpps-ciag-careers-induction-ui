/* eslint-disable @typescript-eslint/no-explicit-any */
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import GetPrisonerByIdResult from '../data/prisonerSearch/getPrisonerByIdResult'
import GetCiagListResult from '../data/prisonerSearch/getCiagListResult'

export interface UserActiveCaseLoad {
  caseLoadId: string
  description: string
}

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getUserActiveCaseLoad(token: string): Promise<UserActiveCaseLoad> {
    const userActiveCaseLoad = await new NomisUserRolesApiClient(token).getUserActiveCaseLoad()
    return {
      caseLoadId: userActiveCaseLoad.activeCaseload.id,
      description: userActiveCaseLoad.activeCaseload.name,
    }
  }

  async getPrisonerById(username: string, id: string): Promise<GetPrisonerByIdResult> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new PrisonerSearchClient(systemToken).getPrisonerById(id)
  }

  async getPrisonerByCaseloadID(username: string, caseloadId: string): Promise<GetCiagListResult[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    return new PrisonerSearchClient(systemToken).getPrisonersByCaseloadId(caseloadId)
  }
}
