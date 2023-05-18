/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getNeurodivergenceResolver'
import { NeurodivergenceSupport } from '../../data/curious/types/Enums'
import getNeurodivergence from './utils/getNeurodivergence'

jest.mock('./utils/getNeurodivergence', () => ({
  ...jest.requireActual('./utils/getNeurodivergence'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getNeurodivergenceResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    prn: req.params.id,
    establishmentId: 'MDI',
    establishmentName: 'HMP Moorland',
    neurodivergenceSupport: [NeurodivergenceSupport.MemorySupport, NeurodivergenceSupport.Reading],
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getNeurodivergenceMock = getNeurodivergence as jest.Mock

  it('On error - Calls next with error', async () => {
    getNeurodivergenceMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getNeurodivergenceMock.mockResolvedValue(mockData.neurodivergenceSupport)

    await resolver(req, res, next)

    expect(req.context.neurodivergence).toEqual([NeurodivergenceSupport.MemorySupport, NeurodivergenceSupport.Reading])

    expect(next).toHaveBeenCalledWith()
  })
})
