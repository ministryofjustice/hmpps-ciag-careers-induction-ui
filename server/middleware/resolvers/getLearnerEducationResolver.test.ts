/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getLearnerEducationResolver'
import getLearnerEducation from './utils/getLearnerEducation'

jest.mock('./utils/getLearnerEducation', () => ({
  ...jest.requireActual('./utils/getLearnerEducation'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getLearnerEducationResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    prn: req.params.id,
    establishmentId: 'MDI',
    courseName: 'Dummy_Automated_320',
    courseCode: '008DUM006',
    learningStartDate: '2021-06-01',
    learningPlannedEndDate: '2021-08-06',
    completionStatus:
      'The learner is continuing or intending to continue the learning activities leading to the learning aim',
    withdrawalReasonAgreed: false,
    fundingModel: 'Adult skills',
    fundingType: 'DPS',
    deliveryMethodType: 'Pack only learning - In Cell/Room',
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getLearnerEducationMock = getLearnerEducation as jest.Mock

  it('On error - Calls next with error', async () => {
    getLearnerEducationMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getLearnerEducationMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.learnerEducation).toEqual({
      prn: 'mock_ref',
      establishmentId: 'MDI',
      courseName: 'Dummy_Automated_320',
      courseCode: '008DUM006',
      learningStartDate: '2021-06-01',
      learningPlannedEndDate: '2021-08-06',
      completionStatus:
        'The learner is continuing or intending to continue the learning activities leading to the learning aim',
      withdrawalReasonAgreed: false,
      fundingModel: 'Adult skills',
      fundingType: 'DPS',
      deliveryMethodType: 'Pack only learning - In Cell/Room',
    })

    expect(next).toHaveBeenCalledWith()
  })
})
