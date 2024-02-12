import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../testsupport/inductionDtoTestDataBuilder'
import toCiagPlan from './ciagPlanMapper'
import CiagPlan from '../ciagApi/interfaces/ciagPlan'
import HopingToGetWorkValue from '../../enums/hopingToGetWorkValue'
import ReasonToNotGetWorkValue from '../../enums/reasonToNotGetWorkValue'
import AdditionalTrainingValue from '../../enums/additionalTrainingValue'
import QualificationLevelValue from '../../enums/qualificationLevelValue'
import InPrisonEducationValue from '../../enums/inPrisonEducationValue'
import InPrisonWorkValue from '../../enums/inPrisonWorkValue'
import AbilityToWorkValue from '../../enums/abilityToWorkValue'
import EducationLevelValue from '../../enums/educationLevelValue'
import PersonalInterestsValue from '../../enums/personalInterestsValue'
import SkillsValue from '../../enums/skillsValue'
import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../../enums/workInterestsValue'

describe('ciagPlanMapper', () => {
  it('should map to CiagPlan given a short question set Induction DTO', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const inductionDto = aShortQuestionSetInductionDto({ prisonNumber })

    const expected: CiagPlan = {
      reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
      offenderId: prisonNumber,
      workOnReleaseReference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
      desireToWork: false,
      hopingToGetWork: HopingToGetWorkValue.NO,
      reasonToNotGetWork: [ReasonToNotGetWorkValue.HEALTH, ReasonToNotGetWorkValue.OTHER],
      reasonToNotGetWorkOther: 'Will be of retirement age at release',
      abilityToWork: undefined,
      abilityToWorkOther: null,

      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: undefined,
      skillsAndInterests: undefined,
      qualificationsAndTraining: {
        qualificationsReference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
        trainingReference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616',
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
        educationLevel: null,
        qualifications: [
          { subject: 'English', level: QualificationLevelValue.LEVEL_6, grade: 'C' },
          { subject: 'Maths', level: QualificationLevelValue.LEVEL_6, grade: 'A*' },
        ],
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      inPrisonInterests: {
        reference: 'ae6a6a94-df32-4a90-b39d-ff1a100a6da0',
        inPrisonEducation: [
          InPrisonEducationValue.CATERING,
          InPrisonEducationValue.FORKLIFT_DRIVING,
          InPrisonEducationValue.OTHER,
        ],
        inPrisonEducationOther: 'Advanced origami',
        inPrisonWork: [InPrisonWorkValue.CLEANING_AND_HYGIENE, InPrisonWorkValue.OTHER],
        inPrisonWorkOther: 'Gardening and grounds keeping',
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },

      createdBy: 'asmith_gen',
      createdDateTime: '2023-06-19T09:39:44.000Z',
      modifiedBy: 'asmith_gen',
      modifiedDateTime: '2023-06-19T09:39:44.000Z',
      prisonId: 'MDI',
      prisonName: undefined,
    }

    // When
    const actual = toCiagPlan(inductionDto)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to CiagPlan given a long question set Induction DTO', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const inductionDto = aLongQuestionSetInductionDto({ prisonNumber })

    const expected: CiagPlan = {
      reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
      offenderId: prisonNumber,
      workOnReleaseReference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
      desireToWork: true,
      hopingToGetWork: HopingToGetWorkValue.YES,
      reasonToNotGetWork: undefined,
      reasonToNotGetWorkOther: null,
      abilityToWork: [AbilityToWorkValue.NONE],
      abilityToWorkOther: null,

      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: {
        reference: 'bb45462e-8225-490d-8c1c-ad6692223d4d',
        hasWorkedBefore: true,
        typeOfWorkExperience: [TypeOfWorkExperienceValue.CONSTRUCTION, TypeOfWorkExperienceValue.OTHER],
        typeOfWorkExperienceOther: 'Retail delivery',
        workExperience: [
          {
            typeOfWorkExperience: TypeOfWorkExperienceValue.CONSTRUCTION,
            role: 'General labourer',
            details: 'Groundwork and basic block work and bricklaying',
          },
          {
            typeOfWorkExperience: TypeOfWorkExperienceValue.OTHER,
            role: 'Milkman',
            details: 'Self employed franchise operator delivering milk and associated diary products.',
          },
        ],
        workInterests: {
          reference: 'cad34670-691d-4862-8014-dc08a6f620b9',
          workInterests: [WorkInterestsValue.CONSTRUCTION, WorkInterestsValue.RETAIL, WorkInterestsValue.OTHER],
          workInterestsOther: 'Film, TV and media',
          particularJobInterests: [
            { workInterest: WorkInterestsValue.CONSTRUCTION, role: 'General labourer' },
            { workInterest: WorkInterestsValue.RETAIL, role: null },
            {
              workInterest: WorkInterestsValue.OTHER,
              role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
            },
          ],
          modifiedBy: 'asmith_gen',
          modifiedDateTime: '2023-06-19T09:39:44.000Z',
        },
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      skillsAndInterests: {
        reference: '517c470f-f9b5-4d49-9148-4458fe358439',
        personalInterests: [
          PersonalInterestsValue.CREATIVE,
          PersonalInterestsValue.DIGITAL,
          PersonalInterestsValue.OTHER,
        ],
        personalInterestsOther: 'Renewable energy',
        skills: [SkillsValue.TEAMWORK, SkillsValue.WILLINGNESS_TO_LEARN, SkillsValue.OTHER],
        skillsOther: 'Tenacity',
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      qualificationsAndTraining: {
        qualificationsReference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
        trainingReference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616',
        additionalTraining: [
          AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
          AdditionalTrainingValue.MANUAL_HANDLING,
          AdditionalTrainingValue.OTHER,
        ],
        additionalTrainingOther: 'Advanced origami',
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications: [{ subject: 'Pottery', level: QualificationLevelValue.LEVEL_4, grade: 'C' }],
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      inPrisonInterests: undefined,

      createdBy: 'asmith_gen',
      createdDateTime: '2023-06-19T09:39:44.000Z',
      modifiedBy: 'asmith_gen',
      modifiedDateTime: '2023-06-19T09:39:44.000Z',
      prisonId: 'MDI',
      prisonName: undefined,
    }

    // When
    const actual = toCiagPlan(inductionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
