import type { CreateOrUpdateInductionDto, InductionDto } from 'dto'
import logger from '../../logger'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toCreateInductionRequest from '../data/mappers/createInductionRequestMapper'
import toInductionDto from '../data/mappers/inductionDtoMapper'

export default class InductionService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async inductionExists(prisonNumber: string, token: string): Promise<boolean> {
    try {
      await this.getInduction(prisonNumber, token)
      return true
    } catch (error) {
      if (error.status === 404) {
        return false
      }
      throw error
    }
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionDto> {
    try {
      const inductionResponse = await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
      return toInductionDto(inductionResponse)
    } catch (error) {
      logger.error('Error retrieving Induction data from Education And Work Plan API', error)
      throw error
    }
  }

  async createInduction(
    prisonNumber: string,
    createInductionDto: CreateOrUpdateInductionDto,
    token: string,
  ): Promise<unknown> {
    try {
      const request = toCreateInductionRequest(createInductionDto)
      return await this.educationAndWorkPlanClient.createInduction(prisonNumber, request, token)
    } catch (error) {
      logger.error(`Error creating Induction within the Education And Work Plan API`, error)
      throw error
    }
  }
}
