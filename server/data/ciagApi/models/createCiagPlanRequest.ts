import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import InPrisonEducationValue from '../../../enums/inPrisonEducationValue'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import SkillsValue from '../../../enums/skillsValue'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import YesNoValue from '../../../enums/yesNoValue'
import CreateCiagPlanArgs from '../interfaces/createCiagPlanArgs'

export default class CreateCiagPlanRequest {
  constructor(offenderId: string, data: CreateCiagPlanArgs) {
    const now = new Date()
    const isoString = now.toISOString()

    this.offenderId = offenderId

    this.desireToWork = data.hopingToGetWork === HopingToGetWorkValue.YES
    this.hopingToGetWork = data.hopingToGetWork

    this.reasonToNotGetWork = data.reasonToNotGetWork
    this.reasonToNotGetWorkOther = data.reasonToNotGetWorkOther

    this.abilityToWork = data.abilityToWork || []
    this.abilityToWorkOther = data.abilityToWorkOther

    this.createdBy = data.currentUser
    this.createdDateTime = isoString

    this.modifiedBy = data.currentUser
    this.modifiedDateTime = isoString

    this.prisonId = data.prisonId

    this.workExperience =
      data.hopingToGetWork === HopingToGetWorkValue.YES
        ? {
            hasWorkedBefore: data.hasWorkedBefore === YesNoValue.YES,
            typeOfWorkExperience: data.typeOfWorkExperience,
            typeOfWorkExperienceOther: data.typeOfWorkExperienceOther,
            workExperience: data.workExperience,
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
            workInterests: {
              workInterests: data.workInterests,
              workInterestsOther: data.workInterestsOther,
              particularJobInterests: data.particularJobInterests,
              modifiedBy: data.currentUser,
              modifiedDateTime: isoString,
            },
          }
        : null

    this.skillsAndInterests =
      data.hopingToGetWork === HopingToGetWorkValue.YES
        ? {
            skills: data.skills,
            skillsOther: data.skillsOther,
            personalInterests: data.personalInterests,
            personalInterestsOther: data.personalInterestsOther,
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
          }
        : null

    this.qualificationsAndTraining = {
      educationLevel: data.educationLevel,
      qualifications: data.qualifications,
      additionalTraining: data.additionalTraining,
      additionalTrainingOther: data.additionalTrainingOther,
      modifiedBy: data.currentUser,
      modifiedDateTime: isoString,
    }

    this.inPrisonInterests =
      data.hopingToGetWork !== HopingToGetWorkValue.YES
        ? {
            inPrisonWork: data.inPrisonWork,
            inPrisonWorkOther: data.inPrisonWorkOther,
            inPrisonEducation: data.inPrisonEducation,
            inPrisonEducationOther: data.inPrisonEducationOther,
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
          }
        : null
  }

  // Properties
  offenderId: string

  desireToWork: boolean

  hopingToGetWork: HopingToGetWorkValue

  reasonToNotGetWork?: Array<ReasonToNotGetWorkValue>

  reasonToNotGetWorkOther?: string

  abilityToWork: Array<AbilityToWorkValue>

  abilityToWorkOther?: string

  createdBy: string

  createdDateTime: string

  modifiedBy: string

  modifiedDateTime: string

  prisonId: string

  workExperience?: {
    hasWorkedBefore: boolean
    typeOfWorkExperience?: Array<TypeOfWorkExperienceValue>
    typeOfWorkExperienceOther?: string
    workExperience?: Array<{
      typeOfWorkExperience: TypeOfWorkExperienceValue
      role: string
      details: string
    }>
    modifiedBy: string
    modifiedDateTime: string

    workInterests?: {
      workInterests: Array<WorkInterestsValue>
      workInterestsOther?: string
      particularJobInterests: Array<{
        workInterest: WorkInterestsValue
        role: string
      }>
      modifiedBy: string
      modifiedDateTime: string
    }
  }

  skillsAndInterests?: {
    skills: Array<SkillsValue>
    skillsOther?: string
    personalInterests: Array<PersonalInterestsValue>
    personalInterestsOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }

  qualificationsAndTraining?: {
    educationLevel?: EducationLevelValue
    qualifications?: Array<{
      subject: string
      grade: string
      level: QualificationLevelValue
    }>
    additionalTraining: Array<AdditionalTrainingValue>
    additionalTrainingOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }

  inPrisonInterests?: {
    inPrisonWork: Array<InPrisonWorkValue>
    inPrisonWorkOther?: string
    inPrisonEducation: Array<InPrisonEducationValue>
    inPrisonEducationOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }
}
