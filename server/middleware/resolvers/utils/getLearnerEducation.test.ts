/* eslint-disable @typescript-eslint/no-explicit-any */
import getLearnerEducation from './getLearnerEducation'

describe('getLearnerEducation', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    prn: id,
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

  const serviceMock = {
    getLearnerEducation: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getLearnerEducation.mockRejectedValue(error)

    try {
      await getLearnerEducation(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getLearnerEducation.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    const result = await getLearnerEducation(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getLearnerEducation.mockResolvedValue(mockData)

    const result = await getLearnerEducation(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
