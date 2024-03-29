import type { InductionDto } from 'dto'
import CiagPlan from '../ciagApi/interfaces/ciagPlan'
import HopingToGetWorkValue from '../../enums/hopingToGetWorkValue'
import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../../enums/workInterestsValue'
import SkillsValue from '../../enums/skillsValue'
import PersonalInterestsValue from '../../enums/personalInterestsValue'
import InPrisonWorkValue from '../../enums/inPrisonWorkValue'
import InPrisonEducationValue from '../../enums/inPrisonEducationValue'
import enumComparator from './enumComparator'
import previousWorkExperienceDtoComparator from './previousWorkExperienceDtoComparator'
import futureWorkInterestDtoComparator from './futureWorkInterestDtoComparator'
import achievedQualificationDtoComparator from './achievedQualificationDtoComparator'

const toCiagPlan = (inductionDto: InductionDto): CiagPlan => {
  return {
    reference: inductionDto.reference,
    offenderId: inductionDto.prisonNumber,
    workOnReleaseReference: inductionDto.workOnRelease.reference,
    desireToWork: inductionDto.workOnRelease.hopingToWork === HopingToGetWorkValue.YES,
    hopingToGetWork: inductionDto.workOnRelease.hopingToWork,
    reasonToNotGetWork: inductionDto.workOnRelease.notHopingToWorkReasons?.sort(enumComparator),
    reasonToNotGetWorkOther: inductionDto.workOnRelease.notHopingToWorkOtherReason,
    abilityToWork: inductionDto.workOnRelease.affectAbilityToWork?.sort(enumComparator),
    abilityToWorkOther: inductionDto.workOnRelease.affectAbilityToWorkOther,

    workExperience: toWorkExperience(inductionDto),
    skillsAndInterests: toSkillsAndInterests(inductionDto),
    qualificationsAndTraining: toQualificationsAndTraining(inductionDto),
    inPrisonInterests: toInPrisonInterests(inductionDto),

    createdBy: inductionDto.createdBy,
    createdDateTime: inductionDto.createdAt.toISOString(),
    modifiedBy: inductionDto.updatedBy,
    modifiedDateTime: inductionDto.updatedAt.toISOString(),
    prisonId: inductionDto.updatedAtPrison,
  }
}

const toWorkExperience = (inductionDto: InductionDto) => {
  return inductionDto.previousWorkExperiences
    ? {
        reference: inductionDto.previousWorkExperiences.reference,
        hasWorkedBefore: inductionDto.previousWorkExperiences.hasWorkedBefore,
        typeOfWorkExperience: inductionDto.previousWorkExperiences.experiences
          .map(experience => experience.experienceType)
          .sort(enumComparator),
        typeOfWorkExperienceOther: inductionDto.previousWorkExperiences.experiences.find(
          experience => experience.experienceType === TypeOfWorkExperienceValue.OTHER,
        )?.experienceTypeOther,
        workExperience: inductionDto.previousWorkExperiences.experiences
          .sort(previousWorkExperienceDtoComparator)
          .map(experience => {
            return {
              typeOfWorkExperience: experience.experienceType,
              role: experience.role,
              details: experience.details,
            }
          }),
        modifiedBy: inductionDto.previousWorkExperiences.updatedBy,
        modifiedDateTime: inductionDto.previousWorkExperiences.updatedAt.toISOString(),

        workInterests: inductionDto.futureWorkInterests
          ? {
              reference: inductionDto.futureWorkInterests.reference,
              workInterests: inductionDto.futureWorkInterests.interests
                .map(interest => interest.workType)
                .sort(enumComparator),
              workInterestsOther: inductionDto.futureWorkInterests.interests.find(
                interest => interest.workType === WorkInterestsValue.OTHER,
              )?.workTypeOther,
              particularJobInterests: inductionDto.futureWorkInterests.interests
                .sort(futureWorkInterestDtoComparator)
                .map(interest => {
                  return {
                    workInterest: interest.workType,
                    role: interest.role,
                  }
                }),
              modifiedBy: inductionDto.futureWorkInterests.updatedBy,
              modifiedDateTime: inductionDto.futureWorkInterests.updatedAt.toISOString(),
            }
          : undefined,
      }
    : undefined
}

const toSkillsAndInterests = (inductionDto: InductionDto) => {
  return inductionDto.personalSkillsAndInterests
    ? {
        reference: inductionDto.personalSkillsAndInterests.reference,
        skills: inductionDto.personalSkillsAndInterests.skills.map(skill => skill.skillType).sort(enumComparator),
        skillsOther: inductionDto.personalSkillsAndInterests.skills.find(skill => skill.skillType === SkillsValue.OTHER)
          ?.skillTypeOther,
        personalInterests: inductionDto.personalSkillsAndInterests.interests
          .map(interest => interest.interestType)
          .sort(enumComparator),
        personalInterestsOther: inductionDto.personalSkillsAndInterests.interests.find(
          interest => interest.interestType === PersonalInterestsValue.OTHER,
        )?.interestTypeOther,
        modifiedBy: inductionDto.personalSkillsAndInterests.updatedBy,
        modifiedDateTime: inductionDto.personalSkillsAndInterests.updatedAt.toISOString(),
      }
    : undefined
}

const toQualificationsAndTraining = (inductionDto: InductionDto) => {
  return inductionDto.previousQualifications
    ? {
        qualificationsReference: inductionDto.previousQualifications.reference,
        educationLevel: inductionDto.previousQualifications.educationLevel,
        qualifications: inductionDto.previousQualifications.qualifications
          .sort(achievedQualificationDtoComparator)
          .map(qualification => {
            return {
              subject: qualification.subject,
              grade: qualification.grade,
              level: qualification.level,
            }
          }),
        trainingReference: inductionDto.previousTraining.reference,
        additionalTraining: (inductionDto.previousTraining?.trainingTypes || []).sort(enumComparator),
        additionalTrainingOther: inductionDto.previousTraining?.trainingTypeOther,
        modifiedBy: inductionDto.previousQualifications.updatedBy,
        modifiedDateTime: inductionDto.previousQualifications.updatedAt.toISOString(),
      }
    : undefined
}
const toInPrisonInterests = (inductionDto: InductionDto) => {
  return inductionDto.inPrisonInterests
    ? {
        reference: inductionDto.inPrisonInterests.reference,
        inPrisonWork: inductionDto.inPrisonInterests.inPrisonWorkInterests
          .map(workInterest => workInterest.workType)
          .sort(enumComparator),
        inPrisonWorkOther: inductionDto.inPrisonInterests.inPrisonWorkInterests.find(
          workInterest => workInterest.workType === InPrisonWorkValue.OTHER,
        )?.workTypeOther,
        inPrisonEducation: inductionDto.inPrisonInterests.inPrisonTrainingInterests
          .map(educationInterest => educationInterest.trainingType)
          .sort(enumComparator),
        inPrisonEducationOther: inductionDto.inPrisonInterests.inPrisonTrainingInterests.find(
          educationInterest => educationInterest.trainingType === InPrisonEducationValue.OTHER,
        )?.trainingTypeOther,
        modifiedBy: inductionDto.inPrisonInterests.updatedBy,
        modifiedDateTime: inductionDto.inPrisonInterests.updatedAt.toISOString(),
      }
    : undefined
}

export default toCiagPlan
