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
    hopingToWork: 'YES' | 'NO' | 'NOT_SURE'
    notHopingToWorkReasons: (
      | 'LIMIT_THEIR_ABILITY'
      | 'FULL_TIME_CARER'
      | 'LACKS_CONFIDENCE_OR_MOTIVATION'
      | 'HEALTH'
      | 'RETIRED'
      | 'NO_RIGHT_TO_WORK'
      | 'NOT_SURE'
      | 'OTHER'
      | 'NO_REASON'
    )[]
    affectAbilityToWork: (
      | 'CARING_RESPONSIBILITIES'
      | 'LIMITED_BY_OFFENSE'
      | 'HEALTH_ISSUES'
      | 'NO_RIGHT_TO_WORK'
      | 'OTHER'
      | 'NONE'
    )[]
    notHopingToWorkOtherReason?: string
    affectAbilityToWorkOther?: string
  }

  export interface PreviousQualificationsDto extends ReferencedAndAuditable {
    educationLevel:
      | 'PRIMARY_SCHOOL'
      | 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS'
      | 'SECONDARY_SCHOOL_TOOK_EXAMS'
      | 'FURTHER_EDUCATION_COLLEGE'
      | 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'NOT_SURE'
    qualifications: Array<AchievedQualificationDto>
  }

  export interface PreviousTrainingDto extends ReferencedAndAuditable {
    trainingTypes: (
      | 'CSCS_CARD'
      | 'FIRST_AID_CERTIFICATE'
      | 'FOOD_HYGIENE_CERTIFICATE'
      | 'FULL_UK_DRIVING_LICENCE'
      | 'HEALTH_AND_SAFETY'
      | 'HGV_LICENCE'
      | 'MACHINERY_TICKETS'
      | 'MANUAL_HANDLING'
      | 'TRADE_COURSE'
      | 'OTHER'
      | 'NONE'
    )[]
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
    hopingToWork: 'YES' | 'NO' | 'NOT_SURE'
    notHopingToWorkReasons?: (
      | 'LIMIT_THEIR_ABILITY'
      | 'FULL_TIME_CARER'
      | 'LACKS_CONFIDENCE_OR_MOTIVATION'
      | 'HEALTH'
      | 'RETIRED'
      | 'NO_RIGHT_TO_WORK'
      | 'NOT_SURE'
      | 'OTHER'
      | 'NO_REASON'
    )[]
    notHopingToWorkOtherReason?: string
    affectAbilityToWork?: (
      | 'CARING_RESPONSIBILITIES'
      | 'LIMITED_BY_OFFENSE'
      | 'HEALTH_ISSUES'
      | 'NO_RIGHT_TO_WORK'
      | 'OTHER'
      | 'NONE'
    )[]
    affectAbilityToWorkOther?: string
  }

  export interface CreatePreviousQualificationsDto {
    educationLevel?:
      | 'PRIMARY_SCHOOL'
      | 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS'
      | 'SECONDARY_SCHOOL_TOOK_EXAMS'
      | 'FURTHER_EDUCATION_COLLEGE'
      | 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'NOT_SURE'
    qualifications?: AchievedQualificationDto[]
  }

  export interface CreatePreviousTrainingDto {
    trainingTypes: (
      | 'CSCS_CARD'
      | 'FIRST_AID_CERTIFICATE'
      | 'FOOD_HYGIENE_CERTIFICATE'
      | 'FULL_UK_DRIVING_LICENCE'
      | 'HEALTH_AND_SAFETY'
      | 'HGV_LICENCE'
      | 'MACHINERY_TICKETS'
      | 'MANUAL_HANDLING'
      | 'TRADE_COURSE'
      | 'OTHER'
      | 'NONE'
    )[]
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
    level: 'ENTRY_LEVEL' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6' | 'LEVEL_7' | 'LEVEL_8'
    grade: string
  }

  export interface PreviousWorkExperienceDto {
    experienceType:
      | 'OUTDOOR'
      | 'CONSTRUCTION'
      | 'DRIVING'
      | 'BEAUTY'
      | 'HOSPITALITY'
      | 'TECHNICAL'
      | 'MANUFACTURING'
      | 'OFFICE'
      | 'RETAIL'
      | 'SPORTS'
      | 'WAREHOUSING'
      | 'WASTE_MANAGEMENT'
      | 'EDUCATION_TRAINING'
      | 'CLEANING_AND_MAINTENANCE'
      | 'OTHER'
    experienceTypeOther?: string
    role?: string
    details?: string
  }

  export interface InPrisonWorkInterestDto {
    workType:
      | 'CLEANING_AND_HYGIENE'
      | 'COMPUTERS_OR_DESK_BASED'
      | 'GARDENING_AND_OUTDOORS'
      | 'KITCHENS_AND_COOKING'
      | 'MAINTENANCE'
      | 'PRISON_LAUNDRY'
      | 'PRISON_LIBRARY'
      | 'TEXTILES_AND_SEWING'
      | 'WELDING_AND_METALWORK'
      | 'WOODWORK_AND_JOINERY'
      | 'OTHER'
    workTypeOther?: string
  }

  export interface InPrisonTrainingInterestDto {
    trainingType:
      | 'BARBERING_AND_HAIRDRESSING'
      | 'CATERING'
      | 'COMMUNICATION_SKILLS'
      | 'ENGLISH_LANGUAGE_SKILLS'
      | 'FORKLIFT_DRIVING'
      | 'INTERVIEW_SKILLS'
      | 'MACHINERY_TICKETS'
      | 'NUMERACY_SKILLS'
      | 'RUNNING_A_BUSINESS'
      | 'SOCIAL_AND_LIFE_SKILLS'
      | 'WELDING_AND_METALWORK'
      | 'WOODWORK_AND_JOINERY'
      | 'OTHER'
    trainingTypeOther?: string
  }

  export interface PersonalSkillDto {
    skillType:
      | 'COMMUNICATION'
      | 'POSITIVE_ATTITUDE'
      | 'RESILIENCE'
      | 'SELF_MANAGEMENT'
      | 'TEAMWORK'
      | 'THINKING_AND_PROBLEM_SOLVING'
      | 'WILLINGNESS_TO_LEARN'
      | 'OTHER'
      | 'NONE'
    skillTypeOther?: string
  }

  export interface PersonalInterestDto {
    interestType:
      | 'COMMUNITY'
      | 'CRAFTS'
      | 'CREATIVE'
      | 'DIGITAL'
      | 'KNOWLEDGE_BASED'
      | 'MUSICAL'
      | 'OUTDOOR'
      | 'NATURE_AND_ANIMALS'
      | 'SOCIAL'
      | 'SOLO_ACTIVITIES'
      | 'SOLO_SPORTS'
      | 'TEAM_SPORTS'
      | 'WELLNESS'
      | 'OTHER'
      | 'NONE'
    interestTypeOther?: string
  }

  export interface FutureWorkInterestDto {
    workType:
      | 'OUTDOOR'
      | 'CONSTRUCTION'
      | 'DRIVING'
      | 'BEAUTY'
      | 'HOSPITALITY'
      | 'TECHNICAL'
      | 'MANUFACTURING'
      | 'OFFICE'
      | 'RETAIL'
      | 'SPORTS'
      | 'WAREHOUSING'
      | 'WASTE_MANAGEMENT'
      | 'EDUCATION_TRAINING'
      | 'CLEANING_AND_MAINTENANCE'
      | 'OTHER'
    workTypeOther?: string
    role?: string
  }
}
