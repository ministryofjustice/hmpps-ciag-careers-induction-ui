import config from '../../config'
import RestClient from '../restClient'
import ActionPlanSummaryResult from './interfaces/actionPlanSummaryResult'

export default class EducationAndWorkPlanApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Education and work plan API', config.apis.educationAndWorkPlanApi, token)
  }

  async getActionPlanList(offenderIds: Array<string>) {
    const result = await this.restClient.post<ActionPlanSummaryResult>({
      path: `/action-plans`,
      data: {
        prisonNumbers: offenderIds,
      },
    })

    return result
  }
}
