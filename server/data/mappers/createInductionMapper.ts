import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateInductionDto } from 'dto'

const toCreateInductionRequest = (createInductionDto: CreateInductionDto): CreateInductionRequest => {
  return {
    ...createInductionDto,
    workOnRelease: {
      ...createInductionDto.workOnRelease,
    },
    previousQualifications: createInductionDto.previousQualifications
      ? {
          ...createInductionDto.previousQualifications,
        }
      : undefined,
    previousTraining: createInductionDto.previousTraining
      ? {
          ...createInductionDto.previousTraining,
        }
      : undefined,
    previousWorkExperiences: createInductionDto.previousWorkExperiences
      ? {
          ...createInductionDto.previousWorkExperiences,
        }
      : undefined,
    inPrisonInterests: createInductionDto.inPrisonInterests
      ? {
          ...createInductionDto.inPrisonInterests,
        }
      : undefined,
    personalSkillsAndInterests: createInductionDto.personalSkillsAndInterests
      ? {
          ...createInductionDto.personalSkillsAndInterests,
        }
      : undefined,
    futureWorkInterests: createInductionDto.futureWorkInterests
      ? {
          ...createInductionDto.futureWorkInterests,
        }
      : undefined,
  }
}

export default toCreateInductionRequest
