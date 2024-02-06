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
import {
  aCreateLongQuestionSetInductionDto,
  aCreateShortQuestionSetInductionDto,
} from '../../testsupport/createInductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from './createOrUpdateInductionDtoMapper'

describe('createOrUpdateInductionDtoMapper', () => {
  it('should map to CreateOrUpdateInductionDto given a short question set CiagPlan', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const ciagPlan: CiagPlan = {
      offenderId: prisonNumber,
      desireToWork: false,
      hopingToGetWork: HopingToGetWorkValue.NO,
      reasonToNotGetWork: [ReasonToNotGetWorkValue.HEALTH, ReasonToNotGetWorkValue.OTHER],
      reasonToNotGetWorkOther: 'Will be of retirement age at release',
      abilityToWork: undefined,
      abilityToWorkOther: undefined,
      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: undefined,
      skillsAndInterests: undefined,
      qualificationsAndTraining: {
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
        educationLevel: undefined,
        qualifications: [
          { subject: 'English', level: QualificationLevelValue.LEVEL_6, grade: 'C' },
          { subject: 'Maths', level: QualificationLevelValue.LEVEL_6, grade: 'A*' },
        ],
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      inPrisonInterests: {
        inPrisonEducation: [
          InPrisonEducationValue.FORKLIFT_DRIVING,
          InPrisonEducationValue.CATERING,
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
      prisonId: 'BXI',
      prisonName: undefined,
    }
    const expected = aCreateShortQuestionSetInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(ciagPlan)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to CreateOrUpdateInductionDto given a long question set CiagPlan', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const ciagPlan: CiagPlan = {
      offenderId: prisonNumber,
      desireToWork: true,
      hopingToGetWork: HopingToGetWorkValue.YES,
      reasonToNotGetWork: undefined,
      reasonToNotGetWorkOther: undefined,
      abilityToWork: [AbilityToWorkValue.NONE],
      abilityToWorkOther: undefined,

      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: {
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
          workInterests: [WorkInterestsValue.RETAIL, WorkInterestsValue.CONSTRUCTION, WorkInterestsValue.OTHER],
          workInterestsOther: 'Film, TV and media',
          particularJobInterests: [
            { workInterest: WorkInterestsValue.RETAIL, role: undefined },
            { workInterest: WorkInterestsValue.CONSTRUCTION, role: 'General labourer' },
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
      prisonId: 'BXI',
      prisonName: undefined,
    }
    const expected = aCreateLongQuestionSetInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(ciagPlan)

    // Then
    expect(actual).toEqual(expected)
  })
})
