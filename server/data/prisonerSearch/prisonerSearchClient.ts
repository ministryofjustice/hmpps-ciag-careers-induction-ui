/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import RestClient from '../restClient'
import GetPrisonerByIdResult from './getPrisonerByIdResult'

export interface ReleaseDateSearch {
  // The lower bound for the release date range of which to search - defaults to today if not provided
  earliestReleaseDate: string
  // The upper bound for the release date range of which to search. A required field.
  latestReleaseDate: string
  // List of Prison Ids (can include OUT and TRN) to restrict the search by. Unrestricted if not supplied or null
  prisonIds: string[]
}

type PrisonerSearchByReleaseDate = ReleaseDateSearch

const GET_PRISONER_BY_ID_PATH = '/prisoner'

// Match prisoners who have a release date within a range, and optionally by prison
const PRISONER_SEARCH_BY_RELEASE_DATE = '/prisoner-search/release-date-by-prison'

export default class PrisonerSearchClient {
  restClient: RestClient

  newToken: string

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Search', config.apis.prisonerSearch, token)

    this.newToken = token
  }

  async getPrisonersByReleaseDate(searchData: PrisonerSearchByReleaseDate) {
    return this.restClient.post<string[]>({
      path: `${PRISONER_SEARCH_BY_RELEASE_DATE}?page=0&size=${config.maximumNumberOfRecordsToReturn}`,
      data: {
        ...searchData,
      },
    })
  }

  async getPrisonerById(id: string): Promise<GetPrisonerByIdResult> {
    return this.restClient.get<GetPrisonerByIdResult>({
      path: `${GET_PRISONER_BY_ID_PATH}/${id}`,
    })
  }
}
