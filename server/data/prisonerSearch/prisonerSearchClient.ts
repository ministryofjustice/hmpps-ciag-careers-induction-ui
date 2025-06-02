/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import LegacyRestClient from '../legacyRestClient'
import GetPrisonerByIdResult from './getPrisonerByIdResult'

const GET_PRISONER_BY_ID_PATH = '/prisoner'

export default class PrisonerSearchClient {
  restClient: LegacyRestClient

  newToken: string

  constructor(token: string) {
    this.restClient = new LegacyRestClient('Prisoner Search', config.apis.prisonerSearch, token)
  }

  async getPrisonerById(id: string): Promise<GetPrisonerByIdResult> {
    return this.restClient.get<GetPrisonerByIdResult>({
      path: `${GET_PRISONER_BY_ID_PATH}/${id}`,
    })
  }
}
