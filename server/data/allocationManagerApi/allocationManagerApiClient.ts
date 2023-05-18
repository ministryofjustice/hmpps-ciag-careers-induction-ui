import config from '../../config'
import RestClient from '../restClient'
import GetPomForOffenderResponse from './getPomForOffenderResponse'

const BASE_URL = '/api'

export default class AllocationManagerApiClient {
  restClient: RestClient

  constructor(systemToken: string) {
    this.restClient = new RestClient('Allocation Managers API', config.apis.allocationManagerApi, systemToken)
  }

  async getPomForOffender(offenderNo: string) {
    const result = await this.restClient.get<GetPomForOffenderResponse>({
      path: `${BASE_URL}/allocation/${offenderNo}`,
    })

    return result
  }
}
