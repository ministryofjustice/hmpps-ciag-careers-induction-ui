/* eslint-disable @typescript-eslint/no-explicit-any */
import CiagService from './ciagService'
import CiagApiClient from '../data/ciagApi/ciagApiClient'
import hopingToGetWorkValue from '../enums/hopingToGetWorkValue'
import abilityToWorkValue from '../enums/abilityToWorkValue'
import YesNoValue from '../enums/yesNoValue'
import workInterestsValue from '../enums/workInterestsValue'
import skillsValue from '../enums/skillsValue'
import personalInterestsValue from '../enums/personalInterestsValue'
import additionalTrainingValue from '../enums/additionalTrainingValue'
import inPrisonWorkValue from '../enums/inPrisonWorkValue'
import inPrisonEducationValue from '../enums/inPrisonEducationValue'

jest.mock('../data/ciagApi/ciagApiClient')

describe('CiagService', () => {
  let ciagApiClientMock: jest.Mocked<CiagApiClient>
  let ciagService: CiagService

  const userToken = 'mock_token'
  const offenderId = 'MOCK_USER'
  const ciagPlan = {
    currentUser: 'USER-1',
    hopingToGetWork: hopingToGetWorkValue.YES,
    hasWorkedBefore: YesNoValue.NO,
    workInterests: [workInterestsValue.DRIVING],
    abilityToWork: [abilityToWorkValue.NONE],
    particularJobInterests: [
      {
        workInterest: workInterestsValue.DRIVING,
        role: 'Driver',
      },
    ],
    skills: [skillsValue.NONE],
    personalInterests: [personalInterestsValue.NONE],
    additionalTraining: [additionalTrainingValue.NONE],
    inPrisonWork: [inPrisonWorkValue.CLEANING_AND_HYGIENE],
    inPrisonEducation: [inPrisonEducationValue.CATERING],
    inPrisonInterests: [
      {
        inPrisonEducation: inPrisonEducationValue.CATERING,
        inPrisonWork: inPrisonWorkValue.CLEANING_AND_HYGIENE,
      },
    ],
    plan: {
      modifiedBy: 'MOCK_USER',
      prisonerNumber: 'mock_prisonerNumber',
    },
  }

  beforeEach(() => {
    ciagApiClientMock = {
      getCiagPlan: jest.fn().mockResolvedValue({
        plan: {
          prisonerNumber: 'mock_prisonerNumber',
          modifiedBy: offenderId,
        },
      }),
      createCiagPlan: jest.fn().mockResolvedValue({}),
      updateCiagPlan: jest.fn().mockResolvedValue({}),
      deleteCiagPlan: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<CiagApiClient>
    ;(CiagApiClient as any).mockImplementation(() => ciagApiClientMock)

    ciagService = new CiagService()
  })

  it('should return CIAG plan for the offender', async () => {
    const result = await ciagService.getCiagPlan(userToken, offenderId)

    expect(ciagApiClientMock.getCiagPlan).toHaveBeenCalledTimes(1)
    expect(result).toBeTruthy()
  })

  it('should create a CiagPlan', async () => {
    await ciagService.createCiagPlan(userToken, offenderId, ciagPlan)

    expect(ciagApiClientMock.createCiagPlan).toHaveBeenCalledWith(offenderId, ciagPlan)
  })

  it('should update a CiagPlan with given values', async () => {
    const updateCiagData = {
      offenderId,
      hopingToGetWork: hopingToGetWorkValue.YES,
      prisonId: 'MDI',
      desireToWork: true,
      abilityToWork: [abilityToWorkValue.HEALTH_ISSUES],
      createdBy: 'mock_user1',
      createdDateTime: '2023-11-02',
      modifiedBy: 'mock_user1',
      modifiedDateTime: '2023-11-02',
    }
    await ciagService.updateCiagPlan(userToken, offenderId, updateCiagData)

    expect(ciagApiClientMock.updateCiagPlan).toHaveBeenCalledWith(offenderId, updateCiagData)
  })
})
