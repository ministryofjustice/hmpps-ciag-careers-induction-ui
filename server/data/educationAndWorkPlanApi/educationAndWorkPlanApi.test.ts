/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import RestClient from '../restClient'
import ActionPlanSummaryResult from './interfaces/actionPlanSummaryResult'
import EducationAndWorkPlanApi from './educationAndWorkPlanApi'

jest.mock('../restClient')

describe('EducationAndWorkPlanApi', () => {
  let client: EducationAndWorkPlanApi
  let restClientMock: jest.Mocked<RestClient>
  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient(
      'Education and Work Plan API',
      config.apis.educationAndWorkPlanApi,
      'token',
    ) as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new EducationAndWorkPlanApi('token')
  })

  describe('getActionPlanList', () => {
    it('should make a POST request to the correct endpoint with the correct parameters', async () => {
      const expectedResult: ActionPlanSummaryResult = {
        actionPlanSummaries: [
          {
            reference: 'mock_ref',
            prisonNumber: offenderNo,
            reviewDate: null,
          },
        ],
      }

      restClientMock.post.mockResolvedValue(expectedResult)
      const result = await client.getActionPlanList([offenderNo])

      expect(result).toEqual(expectedResult)
    })
  })
})
