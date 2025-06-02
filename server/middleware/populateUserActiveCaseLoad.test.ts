/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../testutils/expressMocks'
import middleware from './populateUserActiveCaseLoad'

describe('getUserActiveCaseLoadResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = {}
  req.id = 'mock_ref'

  const mockData = {
    userActiveCaseLoad: {
      mockField: 'mock_value',
    },
  }

  const serviceMock = {
    getUserActiveCaseLoad: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getUserActiveCaseLoad.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to locales and call next', async () => {
    serviceMock.getUserActiveCaseLoad.mockResolvedValue(mockData.userActiveCaseLoad)

    await resolver(req, res, next)

    expect(res.locals.userActiveCaseLoad).toEqual({
      mockField: 'mock_value',
    })
    expect(next).toHaveBeenCalledWith()
  })
})
