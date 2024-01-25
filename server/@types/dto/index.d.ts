import HopingToGetWorkValue from '../../enums/hopingToGetWorkValue'
import ReasonToNotGetWorkValue from '../../enums/reasonToNotGetWorkValue'
import AbilityToWorkValue from '../../enums/abilityToWorkValue'
import AdditionalTrainingValue from '../../enums/additionalTrainingValue'
import EducationLevelValue from '../../enums/educationLevelValue'
import QualificationLevelValue from '../../enums/qualificationLevelValue'
import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
import InPrisonWorkValue from '../../enums/inPrisonWorkValue'
import InPrisonEducationValue from '../../enums/inPrisonEducationValue'
import SkillsValue from '../../enums/skillsValue'
import PersonalInterestsValue from '../../enums/personalInterestsValue'
import WorkInterestsValue from '../../enums/workInterestsValue'

declare module 'dto' {
  /**
   * Interface defining common reference and audit related properties that DTO types can inherit through extension.
   */
  interface ReferencedAndAuditable {
    reference: string
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    createdAtPrison: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: Date
    updatedAtPrison: string
  }

  export interface InductionDto extends ReferencedAndAuditable {
    prisonNumber: string
    workOnRelease: WorkOnReleaseDto
    previousQualifications?: PreviousQualificationsDto
    previousTraining?: PreviousTrainingDto
    previousWorkExperiences?: PreviousWorkExperiencesDto
    inPrisonInterests?: InPrisonInterestsDto
    personalSkillsAndInterests?: PersonalSkillsAndInterestsDto
    futureWorkInterests?: FutureWorkInterestsDto
  }

  export interface WorkOnReleaseDto extends ReferencedAndAuditable {
    hopingToWork: HopingToGetWorkValue
    notHopingToWorkReasons: ReasonToNotGetWorkValue[]
    affectAbilityToWork: AbilityToWorkValue[]
    notHopingToWorkOtherReason?: string
    affectAbilityToWorkOther?: string
  }

  export interface PreviousQualificationsDto extends ReferencedAndAuditable {
    educationLevel: EducationLevelValue
    qualifications: Array<AchievedQualificationDto>
  }

  export interface PreviousTrainingDto extends ReferencedAndAuditable {
    trainingTypes: AdditionalTrainingValue[]
    trainingTypeOther?: string
  }

  export interface PreviousWorkExperiencesDto extends ReferencedAndAuditable {
    hasWorkedBefore: boolean
    experiences: Array<PreviousWorkExperienceDto>
  }

  export interface InPrisonInterestsDto extends ReferencedAndAuditable {
    inPrisonWorkInterests: Array<InPrisonWorkInterestDto>
    inPrisonTrainingInterests: Array<InPrisonTrainingInterestDto>
  }

  export interface PersonalSkillsAndInterestsDto extends ReferencedAndAuditable {
    skills: Array<PersonalSkillDto>
    interests: Array<PersonalInterestDto>
  }

  export interface FutureWorkInterestsDto extends ReferencedAndAuditable {
    interests: Array<FutureWorkInterestDto>
  }

  export interface CreateInductionDto {
    prisonId: string
    workOnRelease: CreateWorkOnReleaseDto
    previousQualifications?: CreatePreviousQualificationsDto
    previousTraining?: CreatePreviousTrainingDto
    previousWorkExperiences?: CreatePreviousWorkExperiencesDto
    inPrisonInterests?: CreateInPrisonInterestsDto
    personalSkillsAndInterests?: CreatePersonalSkillsAndInterestsDto
    futureWorkInterests?: CreateFutureWorkInterestsDto
  }

  export interface CreateWorkOnReleaseDto {
    hopingToWork: HopingToGetWorkValue
    notHopingToWorkReasons?: ReasonToNotGetWorkValue[]
    notHopingToWorkOtherReason?: string
    affectAbilityToWork?: AbilityToWorkValue[]
    affectAbilityToWorkOther?: string
  }

  export interface CreatePreviousQualificationsDto {
    educationLevel?: EducationLevelValue
    qualifications?: AchievedQualificationDto[]
  }

  export interface CreatePreviousTrainingDto {
    trainingTypes: AdditionalTrainingValue[]
    trainingTypeOther?: string
  }

  export interface CreatePreviousWorkExperiencesDto {
    hasWorkedBefore: boolean
    experiences?: PreviousWorkExperienceDto[]
  }

  export interface CreateInPrisonInterestsDto {
    inPrisonWorkInterests: InPrisonWorkInterestDto[]
    inPrisonTrainingInterests: InPrisonTrainingInterestDto[]
  }

  export interface CreatePersonalSkillsAndInterestsDto {
    skills: PersonalSkillDto[]
    interests: PersonalInterestDto[]
  }

  export interface CreateFutureWorkInterestsDto {
    interests: FutureWorkInterestDto[]
  }

  export interface AchievedQualificationDto {
    subject: string
    level: QualificationLevelValue
    grade: string
  }

  export interface PreviousWorkExperienceDto {
    experienceType: TypeOfWorkExperienceValue
    experienceTypeOther?: string
    role?: string
    details?: string
  }

  export interface InPrisonWorkInterestDto {
    workType: InPrisonWorkValue
    workTypeOther?: string
  }

  export interface InPrisonTrainingInterestDto {
    trainingType: InPrisonEducationValue
    trainingTypeOther?: string
  }

  export interface PersonalSkillDto {
    skillType: SkillsValue
    skillTypeOther?: string
  }

  export interface PersonalInterestDto {
    interestType: PersonalInterestsValue
    interestTypeOther?: string
  }

  export interface FutureWorkInterestDto {
    workType: WorkInterestsValue
    workTypeOther?: string
    role?: string
  }
}
