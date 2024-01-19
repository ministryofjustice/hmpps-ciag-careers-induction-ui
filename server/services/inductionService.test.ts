import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import InductionService from './inductionService'
import { aLongQuestionSetInduction } from '../testsupport/inductionResponseTestDataBuilder'

describe('inductionService', () => {
  const educationAndWorkPlanClient = {
    getInduction: jest.fn(),
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

      educationAndWorkPlanClient.getInduction.mockResolvedValue(aLongQuestionSetInduction())

      const expected = true

      // When
      const actual = await inductionService.inductionExists(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
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
})
