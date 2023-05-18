/* eslint-disable @typescript-eslint/no-explicit-any */
import getEmployabilitySkills from './getEmployabilitySkills'

describe('getEmployabilitySkills', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    prn: id,
    establishmentId: 'MDI',
    establishmentName: 'MOORLAND (HMP & YOI)',
    employabilitySkill: 'Problem Solving',
    activityLocation: 'DPS',
    reviews: [
      {
        reviewDate: '2022-01-04',
        currentProgression: '4 - Good demonstration - Substantial evidence provided',
        comment: 'mock_comment',
      },
    ],
  }

  const serviceMock = {
    getLearnerEmployabilitySkills: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getLearnerEmployabilitySkills.mockRejectedValue(error)

    try {
      await getEmployabilitySkills(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getLearnerEmployabilitySkills.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    const result = await getEmployabilitySkills(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getLearnerEmployabilitySkills.mockResolvedValue(mockData)

    const result = await getEmployabilitySkills(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
