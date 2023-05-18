/* eslint-disable @typescript-eslint/no-explicit-any */
import { NeurodivergenceSupport } from '../../../data/curious/types/Enums'
import getNeurodivergence from './getNeurodivergence'

describe('getNeurodivergence', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    prn: id,
    establishmentId: 'MDI',
    establishmentName: 'HMP Moorland',
    neurodivergenceSupport: [NeurodivergenceSupport.MemorySupport, NeurodivergenceSupport.Reading],
  }

  const serviceMock = {
    getLearnerNeurodivergence: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getLearnerNeurodivergence.mockRejectedValue(error)

    try {
      await getNeurodivergence(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getLearnerNeurodivergence.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    const result = await getNeurodivergence(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getLearnerNeurodivergence.mockResolvedValue(mockData)

    const result = await getNeurodivergence(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
