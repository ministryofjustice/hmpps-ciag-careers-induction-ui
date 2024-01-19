import nock from 'nock'
import config from '../config'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import { aShortQuestionSetInduction } from '../testsupport/inductionResponseTestDataBuilder'

describe('educationAndWorkPlanClient', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient()

  config.apis.educationAndWorkPlanApi.url = 'http://localhost:8200'
  let educationAndWorkPlanApi: nock.Scope

  beforeEach(() => {
    educationAndWorkPlanApi = nock(config.apis.educationAndWorkPlanApi.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getInduction', () => {
    it('should get Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedInduction = aShortQuestionSetInduction()
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).reply(200, expectedInduction)

      // When
      const actual = await educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedInduction)
    })

    it('should not get Induction given API returns error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })

    it('should not get Induction given specified prisoner does not have an induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedResponseBody = {
        status: 404,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).reply(404, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(404)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
