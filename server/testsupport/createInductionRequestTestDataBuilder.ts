import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'

const aValidCreateInductionRequestForPrisonerHopingToWork = (): CreateInductionRequest => {
  return {
    prisonId: 'MDI',
    workOnRelease: {
      hopingToWork: 'YES',
      affectAbilityToWork: ['NONE'],
      affectAbilityToWorkOther: null,
      notHopingToWorkReasons: null,
      notHopingToWorkOtherReason: null,
    },
    previousWorkExperiences: {
      hasWorkedBefore: true,
      experiences: [
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
      ],
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
      skills: [
        { skillType: 'TEAMWORK', skillTypeOther: null },
        { skillType: 'WILLINGNESS_TO_LEARN', skillTypeOther: null },
        { skillType: 'OTHER', skillTypeOther: 'Tenacity' },
      ],
      interests: [
        { interestType: 'CREATIVE', interestTypeOther: null },
        { interestType: 'DIGITAL', interestTypeOther: null },
        { interestType: 'OTHER', interestTypeOther: 'Renewable energy' },
      ],
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

const aValidCreateInductionRequestForPrisonerNotHopingToWork = (): CreateInductionRequest => {
  return {
    prisonId: 'MDI',
    workOnRelease: {
      hopingToWork: 'NO',
      affectAbilityToWork: ['FULL_TIME_CARER'],
      affectAbilityToWorkOther: null,
      notHopingToWorkReasons: ['LACKS_CONFIDENCE_OR_MOTIVATION'],
      notHopingToWorkOtherReason: null,
    },
    inPrisonInterests: {
      inPrisonWorkInterests: {
        workType: ['CLEANING_AND_HYGIENE'],
      },
      inPrisonTrainingInterests: {
        trainingType: ['WOODWORK_AND_JOINERY'],
      },
    },
    previousQualifications: {
      educationLevel: null,
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

export { aValidCreateInductionRequestForPrisonerHopingToWork, aValidCreateInductionRequestForPrisonerNotHopingToWork }
