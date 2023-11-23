/* eslint-disable @typescript-eslint/no-explicit-any */
import EducationAndWorkPlanApiClient from '../data/educationAndWorkPlanApi/educationAndWorkPlanApi'
import ActionPlanSummaryResult from '../data/educationAndWorkPlanApi/interfaces/actionPlanSummaryResult'
import EducationAndWorkPlanService from './educationAndWorkPlanService'

jest.mock('../data/educationAndWorkPlanApi/educationAndWorkPlanApi')
jest.mock('../data/educationAndWorkPlanApi/interfaces/actionPlanSummaryResult')

describe('EducationAndWorkPlanService', () => {
  let educationAndWorkPlanService: EducationAndWorkPlanService
  let educationAndWorkPlanApiClient: jest.Mocked<EducationAndWorkPlanApiClient>

  beforeEach(() => {
    educationAndWorkPlanApiClient = new EducationAndWorkPlanApiClient(
      {} as any,
    ) as jest.Mocked<EducationAndWorkPlanApiClient>
    ;(EducationAndWorkPlanApiClient as any).mockImplementation(() => educationAndWorkPlanApiClient)

    educationAndWorkPlanService = new EducationAndWorkPlanService()
    jest.clearAllMocks()
  })

  describe('#getActionPlanList', () => {
    it('should retrieve a list of action plans', async () => {
      const expectedResult: ActionPlanSummaryResult = {
        actionPlanSummaries: [
          {
            reference: 'mock_ref',
            prisonNumber: 'A1234B',
            reviewDate: null,
          },
        ],
      }
      educationAndWorkPlanApiClient.getActionPlanList.mockResolvedValue(expectedResult)
      const result = await educationAndWorkPlanService.getActionPlanList('token', ['MOCK_USER'])

      expect(educationAndWorkPlanApiClient.getActionPlanList).toHaveBeenCalledWith(['MOCK_USER'])
      expect(result).toBeTruthy()
      expect(result).toEqual(expectedResult)
    })
  })
})
