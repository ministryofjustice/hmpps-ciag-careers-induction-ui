import type { InductionResponse } from 'educationAndWorkPlanApiClient'
import logger from '../../logger'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'

export default class InductionService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async inductionExists(prisonNumber: string, token: string): Promise<boolean> {
    return (await this.getInduction(prisonNumber, token)) !== undefined
  }

  private getInduction = async (prisonNumber: string, token: string): Promise<InductionResponse> => {
    try {
      return await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No Induction found for prisoner [${prisonNumber}] in Education And Work Plan API`)
        return undefined
      }

      logger.error(`Error retrieving Induction data from Education And Work Plan: ${JSON.stringify(error)}`)
      throw error
    }
  }
}
