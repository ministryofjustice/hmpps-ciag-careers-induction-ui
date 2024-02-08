import type { CreateOrUpdateInductionDto } from 'dto'
import CiagPlan from '../ciagApi/interfaces/ciagPlan'

const toCreateOrUpdateInductionDto = (ciagPlan: CiagPlan): CreateOrUpdateInductionDto => {
  return {
    reference: undefined,
    prisonId: ciagPlan.prisonId,
    workOnRelease: toCreateOrUpdateWorkOnReleaseDto(ciagPlan),
    previousQualifications: toCreateOrUpdatePreviousQualificationsDto(ciagPlan),
    previousTraining: toCreateOrUpdatePreviousTrainingDto(ciagPlan),
    previousWorkExperiences: toCreateOrUpdatePreviousWorkExperiencesDto(ciagPlan),
    inPrisonInterests: toCreateOrUpdateInPrisonInterestsDto(ciagPlan),
    personalSkillsAndInterests: toCreateOrUpdatePersonalSkillsAndInterestsDto(ciagPlan),
    futureWorkInterests: toCreateOrUpdateFutureWorkInterestsDto(ciagPlan),
  }
}

const toCreateOrUpdateWorkOnReleaseDto = (ciagPlan: CiagPlan) => {
  return {
    hopingToWork: ciagPlan.hopingToGetWork,
    notHopingToWorkReasons: ciagPlan.reasonToNotGetWork,
    notHopingToWorkOtherReason: ciagPlan.reasonToNotGetWorkOther,
    affectAbilityToWork: ciagPlan.abilityToWork,
    affectAbilityToWorkOther: ciagPlan.abilityToWorkOther,
  }
}
const toCreateOrUpdatePreviousQualificationsDto = (ciagPlan: CiagPlan) => {
  return ciagPlan.qualificationsAndTraining
    ? {
        educationLevel: ciagPlan.qualificationsAndTraining.educationLevel,
        qualifications: ciagPlan.qualificationsAndTraining.qualifications?.map(qualification => {
          return {
            subject: qualification.subject,
            grade: qualification.grade,
            level: qualification.level,
          }
        }),
      }
    : undefined
}
const toCreateOrUpdatePreviousTrainingDto = (ciagPlan: CiagPlan) => {
  return ciagPlan.qualificationsAndTraining
    ? {
        trainingTypes: ciagPlan.qualificationsAndTraining.additionalTraining,
        trainingTypeOther: ciagPlan.qualificationsAndTraining.additionalTrainingOther,
      }
    : undefined
}

const toCreateOrUpdatePreviousWorkExperiencesDto = (ciagPlan: CiagPlan) => {
  return ciagPlan.workExperience
    ? {
        hasWorkedBefore: ciagPlan.workExperience.hasWorkedBefore,
        experiences: ciagPlan.workExperience.workExperience?.map(experience => {
          return {
            experienceType: experience.typeOfWorkExperience,
            experienceTypeOther:
              experience.typeOfWorkExperience === 'OTHER'
                ? ciagPlan.workExperience.typeOfWorkExperienceOther
                : undefined,
            role: experience.role,
            details: experience.details,
          }
        }),
      }
    : undefined
}
const toCreateOrUpdateInPrisonInterestsDto = (ciagPlan: CiagPlan) => {
  return ciagPlan.inPrisonInterests
    ? {
        inPrisonWorkInterests: ciagPlan.inPrisonInterests.inPrisonWork?.map(workInterest => {
          return {
            workType: workInterest,
            workTypeOther: workInterest === 'OTHER' ? ciagPlan.inPrisonInterests.inPrisonWorkOther : undefined,
          }
        }),
        inPrisonTrainingInterests: ciagPlan.inPrisonInterests.inPrisonEducation?.map(trainingInterest => {
          return {
            trainingType: trainingInterest,
            trainingTypeOther:
              trainingInterest === 'OTHER' ? ciagPlan.inPrisonInterests.inPrisonEducationOther : undefined,
          }
        }),
      }
    : undefined
}
const toCreateOrUpdatePersonalSkillsAndInterestsDto = (ciagPlan: CiagPlan) => {
  return ciagPlan.skillsAndInterests
    ? {
        skills: ciagPlan.skillsAndInterests.skills?.map(skill => {
          return {
            skillType: skill,
            skillTypeOther: skill === 'OTHER' ? ciagPlan.skillsAndInterests.skillsOther : undefined,
          }
        }),
        interests: ciagPlan.skillsAndInterests.personalInterests?.map(interest => {
          return {
            interestType: interest,
            interestTypeOther: interest === 'OTHER' ? ciagPlan.skillsAndInterests.personalInterestsOther : undefined,
          }
        }),
      }
    : undefined
}
const toCreateOrUpdateFutureWorkInterestsDto = (ciagPlan: CiagPlan) => {
  return ciagPlan.workExperience?.workInterests
    ? {
        interests: ciagPlan.workExperience.workInterests.workInterests?.map(interest => {
          return {
            workType: interest,
            workTypeOther: interest === 'OTHER' ? ciagPlan.workExperience.workInterests.workInterestsOther : undefined,
            role: ciagPlan.workExperience.workInterests.particularJobInterests?.find(
              element => element.workInterest === interest,
            )?.role,
          }
        }),
      }
    : undefined
}

export default toCreateOrUpdateInductionDto
