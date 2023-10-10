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

export default interface CreateCiagPlanArgs {
  currentUser: string
  prisonName?: string

  hopingToGetWork: HopingToGetWorkValue

  reasonToNotGetWork?: Array<ReasonToNotGetWorkValue>
  reasonToNotGetWorkOther?: string

  abilityToWork: Array<AbilityToWorkValue>
  abilityToWorkOther?: string

  hasWorkedBefore: YesNoValue
  typeOfWorkExperience?: Array<TypeOfWorkExperienceValue>
  typeOfWorkExperienceOther?: string

  workExperience?: Array<{
    typeOfWorkExperience: TypeOfWorkExperienceValue
    role: string
    details: string
  }>

  workInterests: Array<WorkInterestsValue>
  workInterestsOther?: string

  particularJobInterests: Array<{
    workInterest: WorkInterestsValue
    role: string
  }>

  skills: Array<SkillsValue>
  skillsOther?: string

  personalInterests: Array<PersonalInterestsValue>
  personalInterestsOther?: string

  educationLevel?: EducationLevelValue

  qualifications?: Array<{
    subject: string
    grade: string
    level: QualificationLevelValue
  }>

  additionalTraining: Array<AdditionalTrainingValue>
  additionalTrainingOther?: string

  inPrisonWork: Array<InPrisonWorkValue>
  inPrisonWorkOther?: string

  inPrisonEducation: Array<InPrisonEducationValue>
  inPrisonEducationOther?: string
}
