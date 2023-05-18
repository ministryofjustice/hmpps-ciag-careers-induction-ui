/* eslint-disable @typescript-eslint/no-explicit-any */
import getLatestAssessment from './getLatestAssessment'

describe('getLatestAssessment', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    prn: id,
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

  const serviceMock = {
    getLearnerLatestAssessment: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getLearnerLatestAssessment.mockRejectedValue(error)

    try {
      await getLatestAssessment(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getLearnerLatestAssessment.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    const result = await getLatestAssessment(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getLearnerLatestAssessment.mockResolvedValue(mockData)

    const result = await getLatestAssessment(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
