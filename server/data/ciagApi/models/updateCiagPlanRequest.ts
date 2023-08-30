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
import CiagPlan from '../interfaces/ciagPlan'

export default class UpdateCiagPlanRequest {
  constructor(data: CiagPlan) {
    this.offenderId = data.offenderId

    this.desireToWork = data.desireToWork
    this.hopingToGetWork = data.hopingToGetWork

    this.reasonToNotGetWork = data.reasonToNotGetWork
    this.reasonToNotGetWorkOther = data.reasonToNotGetWorkOther

    this.abilityToWork = data.abilityToWork
    this.abilityToWorkOther = data.abilityToWorkOther

    this.createdBy = data.createdBy
    this.createdDateTime = data.createdDateTime

    this.modifiedBy = data.modifiedBy
    this.modifiedDateTime = data.modifiedDateTime

    this.workExperience = data.workExperience || null
    this.skillsAndInterests = data.skillsAndInterests || null
    this.qualificationsAndTraining = data.qualificationsAndTraining || null
    this.inPrisonInterests = data.inPrisonInterests || null
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

  workExperience?: {
    id?: number
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
      id?: number
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
    id?: number
    skills: Array<SkillsValue>
    skillsOther?: string
    personalInterests: Array<PersonalInterestsValue>
    personalInterestsOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }

  qualificationsAndTraining?: {
    id?: number
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
    id?: number
    inPrisonWork: Array<InPrisonWorkValue>
    inPrisonWorkOther?: string
    inPrisonEducation: Array<InPrisonEducationValue>
    inPrisonEducationOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }
}
