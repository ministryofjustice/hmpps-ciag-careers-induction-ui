import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateInductionDto } from 'dto'

const toCreateInductionRequest = (createInductionDto: CreateInductionDto): CreateInductionRequest => {
  return { ...createInductionDto }
}

export default toCreateInductionRequest
