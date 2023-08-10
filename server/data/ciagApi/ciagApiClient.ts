import config from '../../config'
import RestClient from '../restClient'
import GetCiagPlanResponse from './getCiagPlanResponse'

export default class CiagApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Ciag Plan API', config.apis.ciagApi, token)
  }

  async getCiagPlan(offenderNo: string) {
    const result = await this.restClient.get<GetCiagPlanResponse>({
      path: `/ciag/${offenderNo}`,
    })

    return result
  }
}
