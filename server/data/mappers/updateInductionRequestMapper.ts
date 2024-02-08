import type { UpdateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateOrUpdateInductionDto } from 'dto'

const toUpdateInductionRequest = (updateInductionDto: CreateOrUpdateInductionDto): UpdateInductionRequest => {
  return { ...updateInductionDto }
}

export default toUpdateInductionRequest
