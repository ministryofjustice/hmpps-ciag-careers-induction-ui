/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getKeyworkerByIdResolver'
import getKeyworkerById from './utils/getKeyworkerById'

jest.mock('./utils/getKeyworkerById', () => ({
  ...jest.requireActual('./utils/getKeyworkerById'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getKeyworkerByIdResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
    status: 'ACTIVE',
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getKeyworkerByIdMock = getKeyworkerById as jest.Mock

  it('On error - Calls next with error', async () => {
    getKeyworkerByIdMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getKeyworkerByIdMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.keyworker).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
