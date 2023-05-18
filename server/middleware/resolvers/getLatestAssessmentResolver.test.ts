/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getLatestAssessmentResolver'
import getLatestAssessment from './utils/getLatestAssessment'

jest.mock('./utils/getLatestAssessment', () => ({
  ...jest.requireActual('./utils/getLatestAssessment'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getLatestAssessmentResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    prn: req.params.id,
    qualifications: [
      {
        establishmentId: 'WDI',
        establishmentName: 'WAKEFIELD (HMP)',
        qualification: {
          qualificationType: 'English',
          qualificationGrade: 'Level 1',
          assessmentDate: '2021-05-03',
        },
      },
    ],
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getLatestAssessmentMock = getLatestAssessment as jest.Mock

  it('On error - Calls next with error', async () => {
    getLatestAssessmentMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getLatestAssessmentMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.learnerLatestAssessment).toEqual({
      prn: 'mock_ref',
      qualifications: [
        {
          establishmentId: 'WDI',
          establishmentName: 'WAKEFIELD (HMP)',
          qualification: {
            qualificationType: 'English',
            qualificationGrade: 'Level 1',
            assessmentDate: '2021-05-03',
          },
        },
      ],
    })

    expect(next).toHaveBeenCalledWith()
  })
})
