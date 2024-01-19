import nock from 'nock'
import CuriousApi from './curiousApi'
import clientFactory from '../oauthEnabledClient'
import AssessmentQualificationType from './types/Enums'
import { LearnerLatestAssessment } from './types/Types'

const hostname = 'http://localhost:8080'

const client = clientFactory({ baseUrl: `${hostname}` })
const curiousApi = CuriousApi.create(client)
const mock = nock(hostname)
const accessToken = 'test_access_token'

describe('curiousApi', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('getLearnerLatestAssessments', () => {
    const dummyLearnerLatestAssessments = getDummyLearnerLatestAssessments()
    it('should return the expected response data', async () => {
      const id = dummyLearnerLatestAssessments[0].prn
      mock
        .get(`/latestLearnerAssessments/${id}`)
        .matchHeader('authorization', `Bearer ${accessToken}`)
        .reply(200, dummyLearnerLatestAssessments)
      const actual = await curiousApi.getLearnerLatestAssessments({ access_token: accessToken }, id)
      expect(actual).toEqual(dummyLearnerLatestAssessments)
    })
  })
})

function getDummyLearnerLatestAssessments(): LearnerLatestAssessment[] {
  return [
    {
      prn: 'G8346GA',
      qualifications: [
        {
          establishmentId: 'WDI',
          establishmentName: 'WAKEFIELD (HMP)',
          qualification: {
            qualificationType: AssessmentQualificationType.English,
            qualificationGrade: 'Entry Level 2',
            assessmentDate: '2021-05-02',
          },
        },
        {
          establishmentId: 'WDI',
          establishmentName: 'WAKEFIELD (HMP)',
          qualification: {
            qualificationType: AssessmentQualificationType.English,
            qualificationGrade: 'Entry Level 2',
            assessmentDate: '2020-12-02',
          },
        },
        {
          establishmentId: 'WDI',
          establishmentName: 'WAKEFIELD (HMP)',
          qualification: {
            qualificationType: AssessmentQualificationType.DigitalLiteracy,
            qualificationGrade: 'Entry Level 1',
            assessmentDate: '2020-06-01',
          },
        },
        {
          establishmentId: 'WDI',
          establishmentName: 'WAKEFIELD (HMP)',
          qualification: {
            qualificationType: AssessmentQualificationType.DigitalLiteracy,
            qualificationGrade: 'Entry Level 2',
            assessmentDate: '2021-06-01',
          },
        },
        {
          establishmentId: 'WDI',
          establishmentName: 'WAKEFIELD (HMP)',
          qualification: {
            qualificationType: AssessmentQualificationType.Maths,
            qualificationGrade: 'Entry Level 2',
            assessmentDate: '2021-06-06',
          },
        },
      ],
    },
  ]
}
