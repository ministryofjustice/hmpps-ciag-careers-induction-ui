/* eslint-disable @typescript-eslint/no-explicit-any */
import getUnacceptableAbsenceCount from './getUnacceptableAbsenceCount'

describe('getUnacceptableAbsenceCount', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    acceptableAbsence: 0,
    unacceptableAbsence: 2,
    total: 4,
  }

  const serviceMock = {
    getUnacceptibleAbsenceCount: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getUnacceptibleAbsenceCount.mockRejectedValue(error)

    try {
      await getUnacceptableAbsenceCount(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getUnacceptibleAbsenceCount.mockResolvedValue(mockData)

    const result = await getUnacceptableAbsenceCount(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
