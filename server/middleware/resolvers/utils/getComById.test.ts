/* eslint-disable @typescript-eslint/no-explicit-any */
import getComById from './getComById'

describe('getComById', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
  }

  const serviceMock = {
    getComForOffender: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getComForOffender.mockRejectedValue(error)

    try {
      await getComById(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getComForOffender.mockRejectedValue({
      status: 404,
    })

    const result = await getComById(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getComForOffender.mockResolvedValue(mockData)

    const result = await getComById(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
