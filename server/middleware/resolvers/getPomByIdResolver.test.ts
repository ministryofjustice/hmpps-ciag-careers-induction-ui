/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getPomByIdResolver'
import getPomById from './utils/getPomById'

jest.mock('./utils/getPomById', () => ({
  ...jest.requireActual('./utils/getPomById'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getPomByIdResolver', () => {
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

  const getPomByIdMock = getPomById as jest.Mock

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    getPomByIdMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getPomByIdMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.pom).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
