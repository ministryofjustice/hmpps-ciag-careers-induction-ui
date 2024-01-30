import type { InductionDto } from 'dto'
import { format } from 'date-fns'
import CiagPlan from '../ciagApi/interfaces/ciagPlan'
import HopingToGetWorkValue from '../../enums/hopingToGetWorkValue'
import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../../enums/workInterestsValue'
import SkillsValue from '../../enums/skillsValue'
import PersonalInterestsValue from '../../enums/personalInterestsValue'
import InPrisonWorkValue from '../../enums/inPrisonWorkValue'
import InPrisonEducationValue from '../../enums/inPrisonEducationValue'

const toCiagPlan = (inductionDto: InductionDto): CiagPlan => {
  return {
    offenderId: inductionDto.prisonNumber,
    desireToWork: inductionDto.workOnRelease.hopingToWork === HopingToGetWorkValue.YES,
    hopingToGetWork: inductionDto.workOnRelease.hopingToWork,
    reasonToNotGetWork: inductionDto.workOnRelease.notHopingToWorkReasons,
    reasonToNotGetWorkOther: inductionDto.workOnRelease.notHopingToWorkOtherReason,
    abilityToWork: inductionDto.workOnRelease.affectAbilityToWork,
    abilityToWorkOther: inductionDto.workOnRelease.affectAbilityToWorkOther,

    workExperience: toWorkExperience(inductionDto),
    skillsAndInterests: toSkillsAndInterests(inductionDto),
    qualificationsAndTraining: toQualificationsAndTraining(inductionDto),
    inPrisonInterests: toInPrisonInterests(inductionDto),

    createdBy: inductionDto.createdBy,
    createdDateTime: format(inductionDto.createdAt, `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`),
    modifiedBy: inductionDto.updatedBy,
    modifiedDateTime: format(inductionDto.updatedAt, `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`),
    prisonId: inductionDto.updatedAtPrison,
    prisonName: undefined, // TODO - check this is a sound decision (not sure what else we might be able to do here)
  }
}

const toWorkExperience = (inductionDto: InductionDto) => {
  return inductionDto.previousWorkExperiences
    ? {
        hasWorkedBefore: inductionDto.previousWorkExperiences.hasWorkedBefore,
        typeOfWorkExperience: inductionDto.previousWorkExperiences.experiences.map(
          experience => experience.experienceType,
        ),
        typeOfWorkExperienceOther: inductionDto.previousWorkExperiences.experiences.find(
          experience => experience.experienceType === TypeOfWorkExperienceValue.OTHER,
        )?.experienceTypeOther,
        workExperience: inductionDto.previousWorkExperiences.experiences.map(experience => {
          return {
            typeOfWorkExperience: experience.experienceType,
            role: experience.role,
            details: experience.details,
          }
        }),
        modifiedBy: inductionDto.previousWorkExperiences.updatedBy,
        modifiedDateTime: format(inductionDto.previousWorkExperiences.updatedAt, `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`),

        workInterests: inductionDto.futureWorkInterests
          ? {
              workInterests: inductionDto.futureWorkInterests.interests.map(interest => interest.workType),
              workInterestsOther: inductionDto.futureWorkInterests.interests.find(
                interest => interest.workType === WorkInterestsValue.OTHER,
              )?.workTypeOther,
              particularJobInterests: inductionDto.futureWorkInterests.interests.map(interest => {
                return {
                  workInterest: interest.workType,
                  role: interest.role,
                }
              }),
              modifiedBy: inductionDto.futureWorkInterests.updatedBy,
              modifiedDateTime: format(inductionDto.futureWorkInterests.updatedAt, `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`),
            }
          : undefined,
      }
    : undefined
}

const toSkillsAndInterests = (inductionDto: InductionDto) => {
  return inductionDto.personalSkillsAndInterests
    ? {
        skills: inductionDto.personalSkillsAndInterests.skills.map(skill => skill.skillType),
        skillsOther: inductionDto.personalSkillsAndInterests.skills.find(skill => skill.skillType === SkillsValue.OTHER)
          ?.skillTypeOther,
        personalInterests: inductionDto.personalSkillsAndInterests.interests.map(interest => interest.interestType),
        personalInterestsOther: inductionDto.personalSkillsAndInterests.interests.find(
          interest => interest.interestType === PersonalInterestsValue.OTHER,
        )?.interestTypeOther,
        modifiedBy: inductionDto.personalSkillsAndInterests.updatedBy,
        modifiedDateTime: format(inductionDto.personalSkillsAndInterests.updatedAt, `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`),
      }
    : undefined
}

const toQualificationsAndTraining = (inductionDto: InductionDto) => {
  return inductionDto.previousQualifications
    ? {
        educationLevel: inductionDto.previousQualifications.educationLevel,
        qualifications: inductionDto.previousQualifications.qualifications.map(qualification => {
          return {
            subject: qualification.subject,
            grade: qualification.grade,
            level: qualification.level,
          }
        }),
        additionalTraining: inductionDto.previousTraining?.trainingTypes || [],
        additionalTrainingOther: inductionDto.previousTraining?.trainingTypeOther,
        modifiedBy: inductionDto.previousQualifications.updatedBy,
        modifiedDateTime: format(inductionDto.previousQualifications.updatedAt, `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`),
      }
    : undefined
}
const toInPrisonInterests = (inductionDto: InductionDto) => {
  return inductionDto.inPrisonInterests
    ? {
        inPrisonWork: inductionDto.inPrisonInterests.inPrisonWorkInterests.map(workInterest => workInterest.workType),
        inPrisonWorkOther: inductionDto.inPrisonInterests.inPrisonWorkInterests.find(
          workInterest => workInterest.workType === InPrisonWorkValue.OTHER,
        )?.workTypeOther,
        inPrisonEducation: inductionDto.inPrisonInterests.inPrisonTrainingInterests.map(
          educationInterest => educationInterest.trainingType,
        ),
        inPrisonEducationOther: inductionDto.inPrisonInterests.inPrisonTrainingInterests.find(
          educationInterest => educationInterest.trainingType === InPrisonEducationValue.OTHER,
        )?.trainingTypeOther,
        modifiedBy: inductionDto.inPrisonInterests.updatedBy,
        modifiedDateTime: format(inductionDto.inPrisonInterests.updatedAt, `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`),
      }
    : undefined
}

export default toCiagPlan
