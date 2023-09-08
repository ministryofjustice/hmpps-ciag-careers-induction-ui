import EducationAndWorkPlanApiClient from '../data/educationAndWorkPlanApi/educationAndWorkPlanApi'
import ActionPlanSummaryResult from '../data/educationAndWorkPlanApi/interfaces/actionPlanSummaryResult'

export default class EducationAndWorkPlanService {
  async getActionPlanList(userToken: string, offenderIds: Array<string>): Promise<ActionPlanSummaryResult> {
    return new EducationAndWorkPlanApiClient(userToken).getActionPlanList(offenderIds)
  }
}
