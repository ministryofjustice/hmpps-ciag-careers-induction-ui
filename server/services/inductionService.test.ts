import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import InductionService from './inductionService'
import { aLongQuestionSetInduction } from '../testsupport/inductionResponseTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../testsupport/inductionDtoTestDataBuilder'
import { aCreateLongQuestionSetInduction } from '../testsupport/createInductionRequestTestDataBuilder'
import { aCreateLongQuestionSetInductionDto } from '../testsupport/createInductionDtoTestDataBuilder'
import toCreateInductionRequest from '../data/mappers/createInductionMapper'
import toInductionDto from '../data/mappers/inductionDtoMapper'

jest.mock('../data/mappers/createInductionMapper')
jest.mock('../data/mappers/inductionDtoMapper')

describe('inductionService', () => {
  const mockedInductionDtoMapper = toInductionDto as jest.MockedFunction<typeof toInductionDto>

  const mockedCreateInductionMapper = toCreateInductionRequest as jest.MockedFunction<typeof toCreateInductionRequest>

  const educationAndWorkPlanClient = {
    getInduction: jest.fn(),
    createInduction: jest.fn(),
  }

  const inductionService = new InductionService(educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('inductionExists', () => {
    it('should determine if Induction exists given Education and Work Plan API returns an Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const inductionResponse = aLongQuestionSetInduction()
      educationAndWorkPlanClient.getInduction.mockResolvedValue(inductionResponse)
      mockedInductionDtoMapper.mockReturnValue(aLongQuestionSetInductionDto())

      const expected = true

      // When
      const actual = await inductionService.inductionExists(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedInductionDtoMapper).toHaveBeenCalledWith(inductionResponse)
    })

    it('should determine if Induction exists given Education and Work Plan API returns Not Found', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `Induction not found for prisoner [${prisonNumber}]`,
          developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      const expected = false

      // When
      const actual = await inductionService.inductionExists(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should rethrow error given Education and Work Plan API returns an unexpected error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService.inductionExists(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })
  })

  describe('getInduction', () => {
    it('should get Induction given Education and Work Plan API returns an Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const inductionResponse = aLongQuestionSetInduction()
      educationAndWorkPlanClient.getInduction.mockResolvedValue(inductionResponse)
      const expectedInductionDto = aLongQuestionSetInductionDto()
      mockedInductionDtoMapper.mockReturnValue(expectedInductionDto)

      // When
      const actual = await inductionService.getInduction(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedInductionDto)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedInductionDtoMapper).toHaveBeenCalledWith(inductionResponse)
    })

    it('should not get Induction given Education and Work Plan API returns Not Found', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `Induction not found for prisoner [${prisonNumber}]`,
          developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService.getInduction(prisonNumber, userToken)

      // Then
      expect(actual).toBeUndefined()
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedInductionDtoMapper).not.toHaveBeenCalled()
    })

    it('should rethrow error given Education and Work Plan API returns an unexpected error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService.getInduction(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedInductionDtoMapper).not.toHaveBeenCalled()
    })
  })

  describe('createInduction', () => {
    it('should create Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const createInductionDto = aCreateLongQuestionSetInductionDto()
      const createRequest = aCreateLongQuestionSetInduction()

      mockedCreateInductionMapper.mockReturnValue(createRequest)

      // When
      await inductionService.createInduction(prisonNumber, createInductionDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.createInduction).toHaveBeenCalledWith(prisonNumber, createRequest, userToken)
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
    })

    it('should fail to create Induction given Education and Work Plan API returns an unexpected error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const createInductionDto = aCreateLongQuestionSetInductionDto()
      const createRequest = aCreateLongQuestionSetInduction()

      mockedCreateInductionMapper.mockReturnValue(createRequest)

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.createInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService
        .createInduction(prisonNumber, createInductionDto, userToken)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
      expect(educationAndWorkPlanClient.createInduction).toHaveBeenCalledWith(prisonNumber, createRequest, userToken)
    })
  })
})
