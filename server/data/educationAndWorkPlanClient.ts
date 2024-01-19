import type { InductionResponse } from 'educationAndWorkPlanApiClient'
import RestClient from './restClient'
import config from '../config'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlanApi, token)
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionResponse> {
    return EducationAndWorkPlanClient.restClient(token).get({
      path: `/inductions/${prisonNumber}`,
    })
  }
}
