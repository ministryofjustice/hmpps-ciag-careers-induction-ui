/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import RestClient from '../restClient'
import GetPrisonerByIdResult from './getPrisonerByIdResult'
import GetCiagListResult from './getCiagListResult'

const GET_PRISONER_BY_ID_PATH = '/prisoner'

// Match prisoners based on caseload id
const PRISONER_SEARCH_BY_CASELOAD_ID = '/prisoner-search/prison'

export default class PrisonerSearchClient {
  restClient: RestClient

  newToken: string

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Search', config.apis.prisonerSearch, token)
  }

  async getPrisonerById(id: string): Promise<GetPrisonerByIdResult> {
    return this.restClient.get<GetPrisonerByIdResult>({
      path: `${GET_PRISONER_BY_ID_PATH}/${id}`,
    })
  }

  async getPrisonersByCaseloadId(caseloadId: string): Promise<GetCiagListResult> {
    return this.restClient.get<GetCiagListResult>({
      path: `${PRISONER_SEARCH_BY_CASELOAD_ID}/${caseloadId}?page=0&size=${config.maximumNumberOfRecordsToReturn}`,
      headers: {
        'content-type': 'application/json',
      },
    })
  }
}
