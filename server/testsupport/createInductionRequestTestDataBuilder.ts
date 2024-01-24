import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'

const aCreateLongQuestionSetInduction = (
  hasWorkedBefore?: boolean,
  hasSkills?: boolean,
  hasInterests?: boolean,
): CreateInductionRequest => {
  return {
    ...baseCreateInductionRequestTemplate(),
    workOnRelease: {
      hopingToWork: 'YES',
      affectAbilityToWork: ['NONE'],
      affectAbilityToWorkOther: null,
      notHopingToWorkReasons: null,
      notHopingToWorkOtherReason: null,
    },
    previousWorkExperiences: {
      hasWorkedBefore: hasWorkedBefore === null || hasWorkedBefore === undefined ? true : hasWorkedBefore,
      experiences:
        hasWorkedBefore === null || hasWorkedBefore === undefined || hasWorkedBefore === true
          ? [
              {
                experienceType: 'CONSTRUCTION',
                experienceTypeOther: null,
                role: 'General labourer',
                details: 'Groundwork and basic block work and bricklaying',
              },
              {
                experienceType: 'OTHER',
                experienceTypeOther: 'Retail delivery',
                role: 'Milkman',
                details: 'Self employed franchise operator delivering milk and associated diary products.',
              },
            ]
          : [],
    },
    futureWorkInterests: {
      interests: [
        {
          workType: 'RETAIL',
          workTypeOther: null,
          role: null,
        },
        {
          workType: 'CONSTRUCTION',
          workTypeOther: null,
          role: 'General labourer',
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ],
    },
    personalSkillsAndInterests: {
      skills:
        hasSkills === null || hasSkills === undefined || hasSkills === true
          ? [
              { skillType: 'TEAMWORK', skillTypeOther: null },
              { skillType: 'WILLINGNESS_TO_LEARN', skillTypeOther: null },
              { skillType: 'OTHER', skillTypeOther: 'Tenacity' },
            ]
          : [],
      interests:
        hasInterests === null || hasInterests === undefined || hasInterests === true
          ? [
              { interestType: 'CREATIVE', interestTypeOther: null },
              { interestType: 'DIGITAL', interestTypeOther: null },
              { interestType: 'OTHER', interestTypeOther: 'Renewable energy' },
            ]
          : [],
    },
    previousQualifications: {
      educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
      qualifications: [
        {
          subject: 'Pottery',
          grade: 'C',
          level: 'LEVEL_4',
        },
      ],
    },
    previousTraining: {
      trainingTypes: ['FIRST_AID_CERTIFICATE', 'MANUAL_HANDLING', 'OTHER'],
      trainingTypeOther: 'Advanced origami',
    },
  }
}

const aCreateShortQuestionSetInduction = (hopingToGetWork?: 'NO' | 'NOT_SURE'): CreateInductionRequest => {
  return {
    ...baseCreateInductionRequestTemplate(),
    workOnRelease: {
      hopingToWork: hopingToGetWork || 'NO',
      affectAbilityToWork: null,
      affectAbilityToWorkOther: null,
      notHopingToWorkReasons: ['HEALTH', 'OTHER'],
      notHopingToWorkOtherReason: 'Will be of retirement age at release',
    },
    inPrisonInterests: {
      inPrisonWorkInterests: [
        { workType: 'CLEANING_AND_HYGIENE', workTypeOther: null },
        { workType: 'OTHER', workTypeOther: 'Gardening and grounds keeping' },
      ],
      inPrisonTrainingInterests: [
        { trainingType: 'FORKLIFT_DRIVING', trainingTypeOther: null },
        { trainingType: 'CATERING', trainingTypeOther: null },
        { trainingType: 'OTHER', trainingTypeOther: 'Advanced origami' },
      ],
    },
    previousQualifications: {
      educationLevel: null,
      qualifications: [
        {
          subject: 'English',
          grade: 'C',
          level: 'LEVEL_6',
        },
        {
          subject: 'Maths',
          grade: 'A*',
          level: 'LEVEL_6',
        },
      ],
    },
    previousTraining: {
      trainingTypes: ['FULL_UK_DRIVING_LICENCE', 'OTHER'],
      trainingTypeOther: 'Beginners cookery for IT professionals',
    },
  }
}

const baseCreateInductionRequestTemplate = (): CreateInductionRequest => {
  return {
    prisonId: 'BXI',
    workOnRelease: undefined,
    previousQualifications: undefined,
    previousTraining: undefined,
    previousWorkExperiences: undefined,
    inPrisonInterests: undefined,
    personalSkillsAndInterests: undefined,
    futureWorkInterests: undefined,
  }
}

export { aCreateLongQuestionSetInduction, aCreateShortQuestionSetInduction }
