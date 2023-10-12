import CiagPlan from '../data/ciagApi/interfaces/ciagPlan'
import CiagApiClient from '../data/ciagApi/ciagApiClient'
import CreateCiagPlanArgs from '../data/ciagApi/interfaces/createCiagPlanArgs'
import CiagPlanListResult from '../data/ciagApi/interfaces/ciagPlanListResult'
import { orderCiagPlanArrays } from '../utils/orderCiagPlanArrays'

export default class CiagService {
  async getCiagPlan(userToken: string, offenderId: string): Promise<CiagPlan> {
    const ciagPlan = await new CiagApiClient(userToken).getCiagPlan(offenderId)
    return orderCiagPlanArrays(ciagPlan)
  }

  async createCiagPlan(userToken: string, offenderId: string, newPlan: CreateCiagPlanArgs): Promise<CiagPlan> {
    return new CiagApiClient(userToken).createCiagPlan(offenderId, newPlan)
  }

  async updateCiagPlan(userToken: string, offenderId: string, updatedPlan: CiagPlan): Promise<CiagPlan> {
    return new CiagApiClient(userToken).updateCiagPlan(offenderId, updatedPlan)
  }

  async deleteCiagPlan(userToken: string, offenderId: string): Promise<CiagPlan> {
    return new CiagApiClient(userToken).deleteCiagPlan(offenderId)
  }

  async getCiagPlanList(userToken: string, offenderIds: Array<string>): Promise<CiagPlanListResult> {
    return new CiagApiClient(userToken).getCiagPlanList(offenderIds)
  }
}
