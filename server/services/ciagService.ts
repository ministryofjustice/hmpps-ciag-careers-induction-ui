import CiagPlan from '../data/ciagApi/interfaces/ciagPlan'
import CiagApiClient from '../data/ciagApi/ciagApiClient'
import CreateCiagPlanArgs from '../data/ciagApi/interfaces/createCiagPlanArgs'

export default class CiagService {
  async getCiagPlan(userToken: string, offenderId: string): Promise<CiagPlan> {
    return new CiagApiClient(userToken).getCiagPlan(offenderId)
  }

  async createCiagPlan(userToken: string, offenderId: string, newPlan: CreateCiagPlanArgs): Promise<CiagPlan> {
    return new CiagApiClient(userToken).createCiagPlan(offenderId, newPlan)
  }

  async deleteCiagPlan(userToken: string, offenderId: string): Promise<CiagPlan> {
    return new CiagApiClient(userToken).deleteCiagPlan(offenderId)
  }
}
