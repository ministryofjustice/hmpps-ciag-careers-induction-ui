import config from '../../config'
import RestClient from '../restClient'
import GetUnacceptibleAbsenceCountResult from './getUnacceptibleAbsenceCountResult'

const BASE_URL = '/attendances'

export default class WhereaboutsApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Whereabouts API', config.apis.whereaboutsApi, token)
  }

  async getUnacceptibleAbsenceCount(offenderNo: string, startDate: Date, endDate: Date) {
    const fromDate = startDate.toISOString().split('T')[0]
    const toDate = endDate.toISOString().split('T')[0]
    const result = await this.restClient.get<GetUnacceptibleAbsenceCountResult>({
      path: `${BASE_URL}/offender/${offenderNo}/unacceptable-absence-count?fromDate=${fromDate}&toDate=${toDate}`,
    })

    return result
  }
}
