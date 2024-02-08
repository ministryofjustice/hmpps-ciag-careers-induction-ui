import type { UpdateInductionRequest } from 'educationAndWorkPlanApiClient'
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

const anUpdateLongQuestionSetInduction = (options?: {
  hasWorkedBefore?: boolean
  hasSkills?: boolean
  hasInterests?: boolean
}): UpdateInductionRequest => {
  return {
    ...baseUpdateInductionRequestTemplate(),
    workOnRelease: {
      reference: '2f4cfa00-40ae-4859-9f96-d7576f989a95',
      hopingToWork: HopingToGetWorkValue.YES,
      affectAbilityToWork: [AbilityToWorkValue.HEALTH_ISSUES],
      affectAbilityToWorkOther: undefined,
      notHopingToWorkReasons: undefined,
      notHopingToWorkOtherReason: undefined,
    },
    previousWorkExperiences: {
      reference: '91e8634a-8ddc-40ee-8854-f099e3e0440f',
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
                experienceType: TypeOfWorkExperienceValue.OTHER,
                experienceTypeOther: 'Retail delivery',
                role: 'Milkman',
                details: 'Self employed franchise operator delivering milk and associated diary products.',
              },
            ]
          : [],
    },
    futureWorkInterests: {
      reference: 'b01c4344-dbbf-417e-8b90-17d19062dfa6',
      interests: [
        {
          workType: WorkInterestsValue.BEAUTY,
          workTypeOther: undefined,
          role: undefined,
        },
        {
          workType: WorkInterestsValue.OTHER,
          workTypeOther: 'Film, TV and media',
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ],
    },
    personalSkillsAndInterests: {
      reference: '2bb27e5e-2d49-4502-8c08-629099561c8a',
      skills:
        !options || options.hasSkills === null || options.hasSkills === undefined || options.hasSkills === true
          ? [
              { skillType: SkillsValue.TEAMWORK, skillTypeOther: undefined },
              { skillType: SkillsValue.OTHER, skillTypeOther: 'Tenacity' },
            ]
          : [],
      interests:
        !options || options.hasInterests === null || options.hasInterests === undefined || options.hasInterests === true
          ? [
              { interestType: PersonalInterestsValue.DIGITAL, interestTypeOther: undefined },
              { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
            ]
          : [],
    },
    previousQualifications: {
      reference: `17f34868-99c9-40ed-b923-ca273cacc096`,
      educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      qualifications: [
        {
          subject: 'Pottery',
          grade: 'C',
          level: QualificationLevelValue.LEVEL_4,
        },
        {
          subject: 'Maths',
          grade: 'B',
          level: QualificationLevelValue.LEVEL_4,
        },
      ],
    },
    previousTraining: {
      reference: '68f47a63-6e4f-4645-80e7-5757be5f6958',
      trainingTypes: [AdditionalTrainingValue.FIRST_AID_CERTIFICATE, AdditionalTrainingValue.OTHER],
      trainingTypeOther: 'Advanced origami',
    },
  }
}

const anUpdateShortQuestionSetInduction = (options?: {
  hopingToGetWork?: HopingToGetWorkValue.NO | HopingToGetWorkValue.NOT_SURE
}): UpdateInductionRequest => {
  return {
    ...baseUpdateInductionRequestTemplate(),
    workOnRelease: {
      reference: '2f4cfa00-40ae-4859-9f96-d7576f989a95',
      hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.NO,
      affectAbilityToWork: undefined,
      affectAbilityToWorkOther: undefined,
      notHopingToWorkReasons: [ReasonToNotGetWorkValue.OTHER],
      notHopingToWorkOtherReason: 'Will be of retirement age at release',
    },
    inPrisonInterests: {
      reference: 'fd6df985-2b77-4f64-a860-f37389fa4dd3',
      inPrisonWorkInterests: [
        { workType: InPrisonWorkValue.CLEANING_AND_HYGIENE, workTypeOther: undefined },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Gardening and grounds keeping' },
      ],
      inPrisonTrainingInterests: [
        { trainingType: InPrisonEducationValue.FORKLIFT_DRIVING, trainingTypeOther: undefined },
        { trainingType: InPrisonEducationValue.OTHER, trainingTypeOther: 'Advanced origami' },
      ],
    },
    previousQualifications: {
      reference: '2f47cae9-9310-4da5-8984-3577be9ce54d',
      educationLevel: undefined,
      qualifications: [
        {
          subject: 'English',
          grade: 'B',
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
      reference: '8ac71798-100e-4652-abbc-5604f231499e',
      trainingTypes: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
      trainingTypeOther: 'Beginners cookery for IT professionals',
    },
  }
}

const baseUpdateInductionRequestTemplate = (): UpdateInductionRequest => {
  return {
    reference: 'b32c7ad6-86a7-45a9-bd63-4bd7cf1ff46f',
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

export { anUpdateLongQuestionSetInduction, anUpdateShortQuestionSetInduction }
