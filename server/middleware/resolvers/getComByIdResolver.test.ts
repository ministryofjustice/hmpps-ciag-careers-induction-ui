/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getComByIdResolver'
import getComById from './utils/getComById'

jest.mock('./utils/getComById', () => ({
  ...jest.requireActual('./utils/getComById'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getComByIdResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const getComByIdMock = getComById as jest.Mock

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    getComByIdMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getComByIdMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.com).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
