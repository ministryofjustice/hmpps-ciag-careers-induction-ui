import type { CreateInductionRequest, InductionResponse, UpdateInductionRequest } from 'educationAndWorkPlanApiClient'
import RestClient from './restClient'
import config from '../config'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlanApi, token)
  }

  async createInduction(prisonNumber: string, createRequest: CreateInductionRequest, token: string): Promise<unknown> {
    return EducationAndWorkPlanClient.restClient(token).post({
      path: `/inductions/${prisonNumber}`,
      data: createRequest,
    })
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionResponse> {
    return EducationAndWorkPlanClient.restClient(token).get({
      path: `/inductions/${prisonNumber}`,
    })
  }

  async updateInduction(prisonNumber: string, updateRequest: UpdateInductionRequest, token: string): Promise<unknown> {
    return EducationAndWorkPlanClient.restClient(token).put({
      path: `/inductions/${prisonNumber}`,
      data: updateRequest,
    })
  }
}
