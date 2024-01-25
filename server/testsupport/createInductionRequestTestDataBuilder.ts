import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'
import SkillsValue from '../enums/skillsValue'
import PersonalInterestsValue from '../enums/personalInterestsValue'
import HopingToGetWorkValue from '../enums/hopingToGetWorkValue'
import AbilityToWorkValue from '../enums/abilityToWorkValue'
import TypeOfWorkExperienceValue from '../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../enums/workInterestsValue'
import EducationLevelValue from '../enums/educationLevelValue'
import QualificationLevelValue from '../enums/qualificationLevelValue'
import AdditionalTrainingValue from '../enums/additionalTrainingValue'
import ReasonToNotGetWorkValue from '../enums/reasonToNotGetWorkValue'
import InPrisonWorkValue from '../enums/inPrisonWorkValue'
import InPrisonEducationValue from '../enums/inPrisonEducationValue'

const aCreateLongQuestionSetInduction = (options?: {
  hasWorkedBefore?: boolean
  hasSkills?: boolean
  hasInterests?: boolean
}): CreateInductionRequest => {
  return {
    ...baseCreateInductionRequestTemplate(),
    workOnRelease: {
      hopingToWork: HopingToGetWorkValue.YES,
      affectAbilityToWork: [AbilityToWorkValue.NONE],
      affectAbilityToWorkOther: null,
      notHopingToWorkReasons: null,
      notHopingToWorkOtherReason: null,
    },
    previousWorkExperiences: {
      hasWorkedBefore:
        !options || options.hasWorkedBefore === null || options.hasWorkedBefore === undefined
          ? true
          : options.hasWorkedBefore,
      experiences:
        !options ||
        options.hasWorkedBefore === null ||
        options.hasWorkedBefore === undefined ||
        options.hasWorkedBefore === true
          ? [
              {
                experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
                experienceTypeOther: null,
                role: 'General labourer',
                details: 'Groundwork and basic block work and bricklaying',
              },
              {
                experienceType: TypeOfWorkExperienceValue.OTHER,
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
          workType: WorkInterestsValue.RETAIL,
          workTypeOther: null,
          role: null,
        },
        {
          workType: WorkInterestsValue.CONSTRUCTION,
          workTypeOther: null,
          role: 'General labourer',
        },
        {
          workType: WorkInterestsValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ],
    },
    personalSkillsAndInterests: {
      skills:
        !options || options.hasSkills === null || options.hasSkills === undefined || options.hasSkills === true
          ? [
              { skillType: SkillsValue.TEAMWORK, skillTypeOther: null },
              { skillType: SkillsValue.WILLINGNESS_TO_LEARN, skillTypeOther: null },
              { skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' },
            ]
          : [],
      interests:
        !options || options.hasInterests === null || options.hasInterests === undefined || options.hasInterests === true
          ? [
              { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: null },
              { interestType: PersonalInterestsValue.DIGITAL, interestTypeOther: null },
              { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
            ]
          : [],
    },
    previousQualifications: {
      educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
      qualifications: [
        {
          subject: 'Pottery',
          grade: 'C',
          level: QualificationLevelValue.LEVEL_4,
        },
      ],
    },
    previousTraining: {
      trainingTypes: [
        AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
        AdditionalTrainingValue.MANUAL_HANDLING,
        AdditionalTrainingValue.OTHER,
      ],
      trainingTypeOther: 'Advanced origami',
    },
  }
}

const aCreateShortQuestionSetInduction = (options?: {
  hopingToGetWork?: HopingToGetWorkValue.NO | HopingToGetWorkValue.NOT_SURE
}): CreateInductionRequest => {
  return {
    ...baseCreateInductionRequestTemplate(),
    workOnRelease: {
      hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.NO,
      affectAbilityToWork: null,
      affectAbilityToWorkOther: null,
      notHopingToWorkReasons: [ReasonToNotGetWorkValue.HEALTH, ReasonToNotGetWorkValue.OTHER],
      notHopingToWorkOtherReason: 'Will be of retirement age at release',
    },
    inPrisonInterests: {
      inPrisonWorkInterests: [
        { workType: InPrisonWorkValue.CLEANING_AND_HYGIENE, workTypeOther: null },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Gardening and grounds keeping' },
      ],
      inPrisonTrainingInterests: [
        { trainingType: InPrisonEducationValue.FORKLIFT_DRIVING, trainingTypeOther: null },
        { trainingType: InPrisonEducationValue.CATERING, trainingTypeOther: null },
        { trainingType: InPrisonEducationValue.OTHER, trainingTypeOther: 'Advanced origami' },
      ],
    },
    previousQualifications: {
      educationLevel: null,
      qualifications: [
        {
          subject: 'English',
          grade: 'C',
          level: QualificationLevelValue.LEVEL_6,
        },
        {
          subject: 'Maths',
          grade: 'A*',
          level: QualificationLevelValue.LEVEL_6,
        },
      ],
    },
    previousTraining: {
      trainingTypes: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
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
