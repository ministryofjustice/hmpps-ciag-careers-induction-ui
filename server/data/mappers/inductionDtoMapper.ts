import { parseISO } from 'date-fns'
import type { InductionResponse } from 'educationAndWorkPlanApiClient'
import type { InductionDto } from 'dto'

const toInductionDto = (inductionResponse: InductionResponse): InductionDto => {
  return {
    ...inductionResponse,
    createdAt: parseISO(inductionResponse.createdAt),
    updatedAt: parseISO(inductionResponse.updatedAt),
    workOnRelease: {
      ...inductionResponse.workOnRelease,
      createdAt: parseISO(inductionResponse.workOnRelease.createdAt),
      updatedAt: parseISO(inductionResponse.workOnRelease.updatedAt),
    },
    previousQualifications: inductionResponse.previousQualifications
      ? {
          ...inductionResponse.previousQualifications,
          createdAt: parseISO(inductionResponse.previousQualifications.createdAt),
          updatedAt: parseISO(inductionResponse.previousQualifications.updatedAt),
        }
      : undefined,
    previousTraining: inductionResponse.previousTraining
      ? {
          ...inductionResponse.previousTraining,
          createdAt: parseISO(inductionResponse.previousTraining.createdAt),
          updatedAt: parseISO(inductionResponse.previousTraining.updatedAt),
        }
      : undefined,
    previousWorkExperiences: inductionResponse.previousWorkExperiences
      ? {
          ...inductionResponse.previousWorkExperiences,
          createdAt: parseISO(inductionResponse.previousWorkExperiences.createdAt),
          updatedAt: parseISO(inductionResponse.previousWorkExperiences.updatedAt),
        }
      : undefined,
    inPrisonInterests: inductionResponse.inPrisonInterests
      ? {
          ...inductionResponse.inPrisonInterests,
          createdAt: parseISO(inductionResponse.inPrisonInterests.createdAt),
          updatedAt: parseISO(inductionResponse.inPrisonInterests.updatedAt),
        }
      : undefined,
    personalSkillsAndInterests: inductionResponse.personalSkillsAndInterests
      ? {
          ...inductionResponse.personalSkillsAndInterests,
          createdAt: parseISO(inductionResponse.personalSkillsAndInterests.createdAt),
          updatedAt: parseISO(inductionResponse.personalSkillsAndInterests.updatedAt),
        }
      : undefined,
    futureWorkInterests: inductionResponse.futureWorkInterests
      ? {
          ...inductionResponse.futureWorkInterests,
          createdAt: parseISO(inductionResponse.futureWorkInterests.createdAt),
          updatedAt: parseISO(inductionResponse.futureWorkInterests.updatedAt),
        }
      : undefined,
  }
}

export default toInductionDto
