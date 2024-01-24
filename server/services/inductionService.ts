import type { InductionDto } from 'dto'
import logger from '../../logger'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toInductionDto from '../data/mappers/inductionDtoMapper'

export default class InductionService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async inductionExists(prisonNumber: string, token: string): Promise<boolean> {
    return (await this.getInduction(prisonNumber, token)) !== undefined
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionDto> {
    try {
      const inductionResponse = await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
      return toInductionDto(inductionResponse)
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
