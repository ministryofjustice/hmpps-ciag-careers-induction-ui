/* eslint-disable @typescript-eslint/no-explicit-any */
import getPomById from './getPomById'

describe('getPomById', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
  }

  const serviceMock = {
    getPomForOffender: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getPomForOffender.mockRejectedValue(error)

    try {
      await getPomById(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getPomForOffender.mockRejectedValue({
      status: 404,
    })

    const result = await getPomById(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getPomForOffender.mockResolvedValue(mockData)

    const result = await getPomById(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
