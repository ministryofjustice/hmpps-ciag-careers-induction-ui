import config from '../../config'
import RestClient from '../restClient'
import CiagPlan from './interfaces/ciagPlan'
import CreateCiagPlanArgs from './interfaces/createCiagPlanArgs'
import CreateCiagPlanRequest from './models/createCiagPlanRequest'
import UpdateCiagPlanRequest from './models/updateCiagPlanRequest'

const BASE_URL = '/ciag/induction'
export default class CiagApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Ciag Plan API', config.apis.ciagApi, token)
  }

  async getCiagPlan(offenderId: string) {
    const result = await this.restClient.get<CiagPlan>({
      path: `${BASE_URL}/${offenderId}`,
    })

    return result
  }

  async createCiagPlan(offenderId: string, newPlan: CreateCiagPlanArgs) {
    const result = await this.restClient.post<CiagPlan>({
      path: `${BASE_URL}/${offenderId}`,
      data: new CreateCiagPlanRequest(offenderId, newPlan),
    })

    return result
  }

  async updateCiagPlan(offenderId: string, updatedPlan: CiagPlan) {
    const result = await this.restClient.put<CiagPlan>({
      path: `${BASE_URL}/${offenderId}`,
      data: new UpdateCiagPlanRequest(updatedPlan),
    })

    return result
  }

  async deleteCiagPlan(offenderId: string) {
    const result = await this.restClient.delete<CiagPlan>({
      path: `${BASE_URL}/${offenderId}`,
    })

    return result
  }
}
