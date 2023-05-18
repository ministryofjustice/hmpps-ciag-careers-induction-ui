import config from '../../config'
import RestClient from '../restClient'
import OffenderManagersResult from './getAllOffenderManagersResult'

const BASE_URL = '/secure'

export default class CommunityApiClient {
  restClient: RestClient

  constructor(systemToken: string) {
    this.restClient = new RestClient('Community API', config.apis.communityApi, systemToken)
  }

  async getAllOffenderManagers(crn: string) {
    const result = await this.restClient.get<OffenderManagersResult[]>({
      path: `${BASE_URL}/offenders/crn/${crn}/allOffenderManagers?includeProbationAreaTeams=true`,
    })

    return result
  }
}
