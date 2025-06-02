import CiagPlan from '../ciagApi/interfaces/ciagPlan'
import UpdateCiagPlanRequest from '../ciagApi/models/updateCiagPlanRequest'
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
import toCreateOrUpdateInductionDto from './createOrUpdateInductionDtoMapper'
import {
  anUpdateLongQuestionSetInductionDto,
  anUpdateShortQuestionSetInductionDto,
} from '../../testsupport/updateInductionDtoTestDataBuilder'

describe('createOrUpdateInductionDtoMapper', () => {
  it('should map to CreateOrUpdateInductionDto given a short question set CiagPlan', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const ciagPlan: CiagPlan = {
      reference: 'b32c7ad6-86a7-45a9-bd63-4bd7cf1ff46f',
      offenderId: prisonNumber,
      workOnReleaseReference: '2f4cfa00-40ae-4859-9f96-d7576f989a95',
      desireToWork: false,
      hopingToGetWork: HopingToGetWorkValue.NO,
      reasonToNotGetWork: [ReasonToNotGetWorkValue.OTHER],
      reasonToNotGetWorkOther: 'Will be of retirement age at release',
      abilityToWork: undefined,
      abilityToWorkOther: undefined,
      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: undefined,
      skillsAndInterests: undefined,
      qualificationsAndTraining: {
        qualificationsReference: '2f47cae9-9310-4da5-8984-3577be9ce54d',
        trainingReference: '8ac71798-100e-4652-abbc-5604f231499e',
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
        educationLevel: undefined,
        qualifications: [
          { subject: 'English', level: QualificationLevelValue.LEVEL_6, grade: 'B' },
          { subject: 'Maths', level: QualificationLevelValue.LEVEL_6, grade: 'A*' },
        ],
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      inPrisonInterests: {
        reference: 'fd6df985-2b77-4f64-a860-f37389fa4dd3',
        inPrisonEducation: [InPrisonEducationValue.FORKLIFT_DRIVING, InPrisonEducationValue.OTHER],
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
    }
    const expected = anUpdateShortQuestionSetInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(ciagPlan)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to CreateOrUpdateInductionDto given a long question set CiagPlan', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const ciagPlan: CiagPlan = {
      reference: 'b32c7ad6-86a7-45a9-bd63-4bd7cf1ff46f',
      offenderId: prisonNumber,
      workOnReleaseReference: '2f4cfa00-40ae-4859-9f96-d7576f989a95',
      desireToWork: true,
      hopingToGetWork: HopingToGetWorkValue.YES,
      reasonToNotGetWork: undefined,
      reasonToNotGetWorkOther: undefined,
      abilityToWork: [AbilityToWorkValue.HEALTH_ISSUES],
      abilityToWorkOther: undefined,

      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: {
        reference: '91e8634a-8ddc-40ee-8854-f099e3e0440f',
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
          reference: 'b01c4344-dbbf-417e-8b90-17d19062dfa6',
          workInterests: [WorkInterestsValue.BEAUTY, WorkInterestsValue.OTHER],
          workInterestsOther: 'Film, TV and media',
          particularJobInterests: [
            { workInterest: WorkInterestsValue.BEAUTY, role: undefined },
            { workInterest: WorkInterestsValue.OTHER, role: 'Being a stunt double for Tom Cruise' },
          ],
          modifiedBy: 'asmith_gen',
          modifiedDateTime: '2023-06-19T09:39:44.000Z',
        },
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      skillsAndInterests: {
        reference: '2bb27e5e-2d49-4502-8c08-629099561c8a',
        personalInterests: [PersonalInterestsValue.DIGITAL, PersonalInterestsValue.OTHER],
        personalInterestsOther: 'Renewable energy',
        skills: [SkillsValue.TEAMWORK, SkillsValue.OTHER],
        skillsOther: 'Tenacity',
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      qualificationsAndTraining: {
        qualificationsReference: '17f34868-99c9-40ed-b923-ca273cacc096',
        trainingReference: '68f47a63-6e4f-4645-80e7-5757be5f6958',
        additionalTraining: [AdditionalTrainingValue.FIRST_AID_CERTIFICATE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Advanced origami',
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [
          { subject: 'Pottery', level: QualificationLevelValue.LEVEL_4, grade: 'C' },
          { subject: 'Maths', level: QualificationLevelValue.LEVEL_4, grade: 'B' },
        ],
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      inPrisonInterests: undefined,
      createdBy: 'asmith_gen',
      createdDateTime: '2023-06-19T09:39:44.000Z',
      modifiedBy: 'asmith_gen',
      modifiedDateTime: '2023-06-19T09:39:44.000Z',
      prisonId: 'BXI',
    }
    const expected = anUpdateLongQuestionSetInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(ciagPlan)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to CreateOrUpdateInductionDto given a short question set UpdateCiagPlanRequest', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const ciagPlan: UpdateCiagPlanRequest = {
      reference: 'b32c7ad6-86a7-45a9-bd63-4bd7cf1ff46f',
      offenderId: prisonNumber,
      workOnReleaseReference: '2f4cfa00-40ae-4859-9f96-d7576f989a95',
      desireToWork: false,
      hopingToGetWork: HopingToGetWorkValue.NO,
      reasonToNotGetWork: [ReasonToNotGetWorkValue.OTHER],
      reasonToNotGetWorkOther: 'Will be of retirement age at release',
      abilityToWork: undefined,
      abilityToWorkOther: undefined,
      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: undefined,
      skillsAndInterests: undefined,
      qualificationsAndTraining: {
        qualificationsReference: '2f47cae9-9310-4da5-8984-3577be9ce54d',
        trainingReference: '8ac71798-100e-4652-abbc-5604f231499e',
        additionalTraining: [AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Beginners cookery for IT professionals',
        educationLevel: undefined,
        qualifications: [
          { subject: 'English', level: QualificationLevelValue.LEVEL_6, grade: 'B' },
          { subject: 'Maths', level: QualificationLevelValue.LEVEL_6, grade: 'A*' },
        ],
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      inPrisonInterests: {
        reference: 'fd6df985-2b77-4f64-a860-f37389fa4dd3',
        inPrisonEducation: [InPrisonEducationValue.FORKLIFT_DRIVING, InPrisonEducationValue.OTHER],
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
    }
    const expected = anUpdateShortQuestionSetInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(ciagPlan)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to CreateOrUpdateInductionDto given a long question set UpdateCiagPlanRequest', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const ciagPlan: UpdateCiagPlanRequest = {
      reference: 'b32c7ad6-86a7-45a9-bd63-4bd7cf1ff46f',
      offenderId: prisonNumber,
      workOnReleaseReference: '2f4cfa00-40ae-4859-9f96-d7576f989a95',
      desireToWork: true,
      hopingToGetWork: HopingToGetWorkValue.YES,
      reasonToNotGetWork: undefined,
      reasonToNotGetWorkOther: undefined,
      abilityToWork: [AbilityToWorkValue.HEALTH_ISSUES],
      abilityToWorkOther: undefined,

      // The properties workExperience, skillsAndInterests, qualificationsAndTraining and inPrisonInterests are
      // fundamentally the difference between a short and long question set CiagPlan
      workExperience: {
        reference: '91e8634a-8ddc-40ee-8854-f099e3e0440f',
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
          reference: 'b01c4344-dbbf-417e-8b90-17d19062dfa6',
          workInterests: [WorkInterestsValue.BEAUTY, WorkInterestsValue.OTHER],
          workInterestsOther: 'Film, TV and media',
          particularJobInterests: [
            { workInterest: WorkInterestsValue.BEAUTY, role: undefined },
            { workInterest: WorkInterestsValue.OTHER, role: 'Being a stunt double for Tom Cruise' },
          ],
          modifiedBy: 'asmith_gen',
          modifiedDateTime: '2023-06-19T09:39:44.000Z',
        },
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      skillsAndInterests: {
        reference: '2bb27e5e-2d49-4502-8c08-629099561c8a',
        personalInterests: [PersonalInterestsValue.DIGITAL, PersonalInterestsValue.OTHER],
        personalInterestsOther: 'Renewable energy',
        skills: [SkillsValue.TEAMWORK, SkillsValue.OTHER],
        skillsOther: 'Tenacity',
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      qualificationsAndTraining: {
        qualificationsReference: '17f34868-99c9-40ed-b923-ca273cacc096',
        trainingReference: '68f47a63-6e4f-4645-80e7-5757be5f6958',
        additionalTraining: [AdditionalTrainingValue.FIRST_AID_CERTIFICATE, AdditionalTrainingValue.OTHER],
        additionalTrainingOther: 'Advanced origami',
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [
          { subject: 'Pottery', level: QualificationLevelValue.LEVEL_4, grade: 'C' },
          { subject: 'Maths', level: QualificationLevelValue.LEVEL_4, grade: 'B' },
        ],
        modifiedBy: 'asmith_gen',
        modifiedDateTime: '2023-06-19T09:39:44.000Z',
      },
      inPrisonInterests: undefined,
      createdBy: 'asmith_gen',
      createdDateTime: '2023-06-19T09:39:44.000Z',
      modifiedBy: 'asmith_gen',
      modifiedDateTime: '2023-06-19T09:39:44.000Z',
      prisonId: 'BXI',
    }
    const expected = anUpdateLongQuestionSetInductionDto()

    // When
    const actual = toCreateOrUpdateInductionDto(ciagPlan)

    // Then
    expect(actual).toEqual(expected)
  })
})
