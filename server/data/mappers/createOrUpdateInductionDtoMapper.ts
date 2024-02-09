import type { CreateOrUpdateInductionDto } from 'dto'
import CiagPlan from '../ciagApi/interfaces/ciagPlan'

const toCreateOrUpdateInductionDto = (ciagPlan: CiagPlan): CreateOrUpdateInductionDto => {
  return {
    reference: ciagPlan.reference,
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
    reference: ciagPlan.workOnReleaseReference,
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
        reference: ciagPlan.qualificationsAndTraining.qualificationsReference,
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
        reference: ciagPlan.qualificationsAndTraining.trainingReference,
        trainingTypes: ciagPlan.qualificationsAndTraining.additionalTraining,
        trainingTypeOther: ciagPlan.qualificationsAndTraining.additionalTrainingOther,
      }
    : undefined
}

const toCreateOrUpdatePreviousWorkExperiencesDto = (ciagPlan: CiagPlan) => {
  return ciagPlan.workExperience
    ? {
        reference: ciagPlan.workExperience.reference,
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
        reference: ciagPlan.inPrisonInterests.reference,
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
        reference: ciagPlan.skillsAndInterests.reference,
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
        reference: ciagPlan.workExperience.workInterests.reference,
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
