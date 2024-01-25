import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateOrUpdateInductionDto } from 'dto'

const toCreateInductionRequest = (createInductionDto: CreateOrUpdateInductionDto): CreateInductionRequest => {
  return { ...createInductionDto }
}

export default toCreateInductionRequest
