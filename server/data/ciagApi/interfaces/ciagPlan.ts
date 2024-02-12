import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import InPrisonEducationValue from '../../../enums/inPrisonEducationValue'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import SkillsValue from '../../../enums/skillsValue'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'

export default interface CiagPlan {
  reference?: string
  offenderId: string

  workOnReleaseReference?: string
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
  prisonId?: string
  prisonName?: string

  workExperience?: {
    reference?: string
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
      reference?: string
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
    reference?: string
    id?: number

    skills: Array<SkillsValue>
    skillsOther?: string

    personalInterests: Array<PersonalInterestsValue>
    personalInterestsOther?: string

    modifiedBy: string
    modifiedDateTime: string
  }

  qualificationsAndTraining?: {
    qualificationsReference?: string
    id?: number

    educationLevel?: EducationLevelValue

    qualifications?: Array<{
      subject: string
      grade: string
      level: QualificationLevelValue
    }>

    trainingReference?: string
    additionalTraining: Array<AdditionalTrainingValue>
    additionalTrainingOther?: string

    modifiedBy: string
    modifiedDateTime: string
  }

  inPrisonInterests?: {
    reference?: string
    id?: number

    inPrisonWork: Array<InPrisonWorkValue>
    inPrisonWorkOther?: string

    inPrisonEducation: Array<InPrisonEducationValue>
    inPrisonEducationOther?: string

    modifiedBy: string
    modifiedDateTime: string
  }
}
