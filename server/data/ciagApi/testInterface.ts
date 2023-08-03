import AbilityToWorkValue from '../../enums/abilityToWorkValue'
import EducationLevelValue from '../../enums/educationLevelValue'
import HopingToGetWorkValue from '../../enums/hopingToGetWorkValue'
import InPrisonEducationValue from '../../enums/inPrisonEducationValue'
import InPrisonWorkValue from '../../enums/inPrisonWorkValue'
import OtherQualificationsValue from '../../enums/otherQualificationsValue'
import PersonalInterestsValue from '../../enums/personalInterestsValue'
import QualificationLevelValue from '../../enums/qualificationLevelValue'
import SkillsValue from '../../enums/skillsValue'
import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../../enums/workInterestsValue'

export default interface CiagPlan {
  offenderId: string

  hopingToGetWork: HopingToGetWorkValue.YES | HopingToGetWorkValue.NO | HopingToGetWorkValue.NOT_SURE
  reasonToNotGetWork:
    | 'LIMIT_THEIR_ABILITY'
    | 'FULL_TIME_CARER'
    | 'LACKS_CONFIDENCE_OR_MOTIVATION'
    | 'HEALTH'
    | 'NO_REASON'
    | 'RETIRED'
    | 'NO_RIGHT_TO_WORK'
    | 'OTHER'

  abilityToWork: Array<
    | AbilityToWorkValue.LIMITED_BY_OFFENSE
    | AbilityToWorkValue.CARING_RESPONSIBILITIES
    | AbilityToWorkValue.HEALTH_ISSUES
    | AbilityToWorkValue.NO_RIGHT_TO_WORK
    | AbilityToWorkValue.OTHER
    | AbilityToWorkValue.NONE
  >
  abilityToWorkOther: string

  createdBy: string
  createdDateTime: string

  modifiedBy: string
  modifiedDateTime: string

  workExperience?: {
    hasWorkedBefore: boolean
    typeOfWorkExperience: Array<
      | TypeOfWorkExperienceValue.OUTDOOR
      | TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE
      | TypeOfWorkExperienceValue.CONSTRUCTION
      | TypeOfWorkExperienceValue.DRIVING
      | TypeOfWorkExperienceValue.BEAUTY
      | TypeOfWorkExperienceValue.HOSPITALITY
      | TypeOfWorkExperienceValue.TECHNICAL
      | TypeOfWorkExperienceValue.MANUFACTURING
      | TypeOfWorkExperienceValue.OFFICE
      | TypeOfWorkExperienceValue.RETAIL
      | TypeOfWorkExperienceValue.SPORTS
      | TypeOfWorkExperienceValue.WAREHOUSING
      | TypeOfWorkExperienceValue.WASTE_MANAGEMENT
      | TypeOfWorkExperienceValue.EDUCATION_TRAINING
      | TypeOfWorkExperienceValue.OTHER
    >
    typeOfWorkExperienceOther?: string

    workExperience: Array<{
      typeOfWorkExperience:
        | TypeOfWorkExperienceValue.OUTDOOR
        | TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE
        | TypeOfWorkExperienceValue.CONSTRUCTION
        | TypeOfWorkExperienceValue.DRIVING
        | TypeOfWorkExperienceValue.BEAUTY
        | TypeOfWorkExperienceValue.HOSPITALITY
        | TypeOfWorkExperienceValue.TECHNICAL
        | TypeOfWorkExperienceValue.MANUFACTURING
        | TypeOfWorkExperienceValue.OFFICE
        | TypeOfWorkExperienceValue.RETAIL
        | TypeOfWorkExperienceValue.SPORTS
        | TypeOfWorkExperienceValue.WAREHOUSING
        | TypeOfWorkExperienceValue.WASTE_MANAGEMENT
        | TypeOfWorkExperienceValue.EDUCATION_TRAINING
        | TypeOfWorkExperienceValue.OTHER
      role: string
      details: string
    }>

    modifiedBy: string
    modifiedDateTime: string
  }

  workInterests?: {
    workInterests: Array<
      | WorkInterestsValue.OUTDOOR
      | WorkInterestsValue.CLEANING_AND_MAINTENANCE
      | WorkInterestsValue.CONSTRUCTION
      | WorkInterestsValue.DRIVING
      | WorkInterestsValue.BEAUTY
      | WorkInterestsValue.HOSPITALITY
      | WorkInterestsValue.TECHNICAL
      | WorkInterestsValue.MANUFACTURING
      | WorkInterestsValue.OFFICE
      | WorkInterestsValue.RETAIL
      | WorkInterestsValue.SPORTS
      | WorkInterestsValue.WAREHOUSING
      | WorkInterestsValue.WASTE_MANAGEMENT
      | WorkInterestsValue.EDUCATION_TRAINING
      | WorkInterestsValue.OTHER
    >
    workInterestsOther?: string

    particularJobInterests: Array<{
      workInterest:
        | WorkInterestsValue.OUTDOOR
        | WorkInterestsValue.CLEANING_AND_MAINTENANCE
        | WorkInterestsValue.CONSTRUCTION
        | WorkInterestsValue.DRIVING
        | WorkInterestsValue.BEAUTY
        | WorkInterestsValue.HOSPITALITY
        | WorkInterestsValue.TECHNICAL
        | WorkInterestsValue.MANUFACTURING
        | WorkInterestsValue.OFFICE
        | WorkInterestsValue.RETAIL
        | WorkInterestsValue.SPORTS
        | WorkInterestsValue.WAREHOUSING
        | WorkInterestsValue.WASTE_MANAGEMENT
        | WorkInterestsValue.EDUCATION_TRAINING
        | WorkInterestsValue.OTHER
      role: string
    }>

    modifiedBy: string
    modifiedDateTime: string
  }

  skillsAndInterests?: {
    skills: Array<
      | SkillsValue.COMMUNICATION
      | SkillsValue.POSITIVE_ATTITUDE
      | SkillsValue.RESILIENCE
      | SkillsValue.SELF_MANAGEMENT
      | SkillsValue.TEAMWORK
      | SkillsValue.THINKING_PROBLEM_SOLVING
      | SkillsValue.WILLINGNESS_TO_LEARN
      | SkillsValue.OTHER
      | SkillsValue.NONE
    >
    skillsOther?: string

    personalInterests: Array<
      | PersonalInterestsValue.COMMUNITY
      | PersonalInterestsValue.CRAFTS
      | PersonalInterestsValue.CREATIVE
      | PersonalInterestsValue.DIGITAL
      | PersonalInterestsValue.KNOWLEDGE_BASED
      | PersonalInterestsValue.MUSICAL
      | PersonalInterestsValue.OUTDOOR
      | PersonalInterestsValue.NATURE_AND_ANIMALS
      | PersonalInterestsValue.SOCIAL
      | PersonalInterestsValue.SOLO_ACTIVITIES
      | PersonalInterestsValue.SOLO_SPORTS
      | PersonalInterestsValue.TEAM_SPORTS
      | PersonalInterestsValue.WELLNESS
      | PersonalInterestsValue.OTHER
      | PersonalInterestsValue.NONE
    >
    personalInterestsOther?: string

    modifiedBy: string
    modifiedDateTime: string
  }

  qualificationsAndTrainin?: {
    educationLevel:
      | EducationLevelValue.PRIMARY_SCHOOL
      | EducationLevelValue.SECONDARY_SCHOOL_NO_EXAMS
      | EducationLevelValue.SECONDARY_SCHOOL_EXAMS
      | EducationLevelValue.FURTHER_EDUCATION_COLLEGE
      | EducationLevelValue.UNDERGRADUATE_DEGREE
      | EducationLevelValue.POSTGRADUATE_DEGREE
      | EducationLevelValue.NOT_SURE

    qualifications: Array<{
      subject: string
      grade: string
      level:
        | QualificationLevelValue.ENTRY_LEVEL
        | QualificationLevelValue.LEVEL_1
        | QualificationLevelValue.LEVEL_2
        | QualificationLevelValue.LEVEL_3
        | QualificationLevelValue.LEVEL_4
        | QualificationLevelValue.LEVEL_5
        | QualificationLevelValue.LEVEL_6
        | QualificationLevelValue.LEVEL_7
        | QualificationLevelValue.LEVEL_8
    }>

    otherQualifications: Array<
      | OtherQualificationsValue.CSCS
      | OtherQualificationsValue.DRIVING_LICENSE
      | OtherQualificationsValue.FIRST_AID
      | OtherQualificationsValue.FOOD_HYGIENE
      | OtherQualificationsValue.HEALTH_AND_SAFETY
      | OtherQualificationsValue.HGV_LICENSE
      | OtherQualificationsValue.MACHINERY
      | OtherQualificationsValue.MANUAL
      | OtherQualificationsValue.TRADE
      | OtherQualificationsValue.OTHER
      | OtherQualificationsValue.NONE
    >
    otherQualificationsOther?: string

    modifiedBy: string
    modifiedDateTime: string
  }

  inPrisonInterests?: {
    inPrisonWork: Array<
      | InPrisonWorkValue.CLEANING_AND_HYGIENE
      | InPrisonWorkValue.COMPUTERS_OR_DESK_BASED
      | InPrisonWorkValue.GARDENING_AND_OUTDOORS
      | InPrisonWorkValue.KITCHENS_AND_COOKING
      | InPrisonWorkValue.MAINTENANCE
      | InPrisonWorkValue.PRISON_LAUNDRY
      | InPrisonWorkValue.PRISON_LIBRARY
      | InPrisonWorkValue.TEXTILES_AND_SEWING
      | InPrisonWorkValue.WELDING_AND_METALWORK
      | InPrisonWorkValue.WOODWORK_AND_JOINERY
      | InPrisonWorkValue.OTHER
    >
    inPrisonWorkOther?: string

    inPrisonEducation: Array<
      | InPrisonEducationValue.BARBERING_AND_HAIRDRESSING
      | InPrisonEducationValue.CATERING
      | InPrisonEducationValue.COMMUNICATION_SKILLS
      | InPrisonEducationValue.ENGLISH_LANGUAGE_SKILLS
      | InPrisonEducationValue.FORKLIFT_DRIVING
      | InPrisonEducationValue.INTERVIEW_SKILLS
      | InPrisonEducationValue.MACHINERY_TICKETS
      | InPrisonEducationValue.NUMERACY_SKILLS
      | InPrisonEducationValue.RUNNING_A_BUSINESS
      | InPrisonEducationValue.SOCIAL_AND_LIFE_SKILLS
      | InPrisonEducationValue.WELDING_AND_METALWORK
      | InPrisonEducationValue.WOODWORK_AND_JOINERY
      | InPrisonEducationValue.OTHER
    >
    inPrisonEducationOther?: string

    modifiedBy: string
    modifiedDateTime: string
  }
}
