import config from '../../config'
import RestClient from '../restClient'
import GetKeyworkerForOffenderResponse from './getKeyworkerForOffenderResponse'

const BASE_URL = '/key-worker'

export default class KeyworkerApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Keyworker API', config.apis.keyworkerApi, token)
  }

  async getKeyworkerForOffender(offenderNo: string) {
    const result = await this.restClient.get<GetKeyworkerForOffenderResponse>({
      path: `${BASE_URL}/offender/${offenderNo}`,
    })

    return result
  }
}
