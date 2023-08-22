/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getCiagPlanByIdResolver'

describe('getCiagPlanByIdResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = {}
  req.id = 'mock_ref'

  const mockData = {
    plan: {
      prisonerNumber: 'mock_prisonerNumber',
      modifiedBy: 'MOCK_USER',
    },
  }

  const serviceMock = {
    getCiagPlan: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getCiagPlan.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 400 error - Calls next without error', async () => {
    serviceMock.getCiagPlan.mockRejectedValue({
      data: {
        status: 400,
        userMessage: 'CIAG profile does not exist',
      },
    })

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getCiagPlan.mockResolvedValue(mockData.plan)

    await resolver(req, res, next)

    expect(req.context.plan).toEqual({
      prisonerNumber: 'mock_prisonerNumber',
      modifiedBy: 'MOCK_USER',
    })
    expect(next).toHaveBeenCalledWith()
  })
})
