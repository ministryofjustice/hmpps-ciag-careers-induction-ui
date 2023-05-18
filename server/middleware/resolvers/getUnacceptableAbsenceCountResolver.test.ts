/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getUnacceptableAbsenceCountResolver'
import getUnacceptableAbsenceCount from './utils/getUnacceptableAbsenceCount'

jest.mock('./utils/getUnacceptableAbsenceCount', () => ({
  ...jest.requireActual('./utils/getUnacceptableAbsenceCount'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getUnacceptableAbsencesCountResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = {
    acceptableAbsence: 0,
    unacceptableAbsence: 2,
    total: 4,
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getUnacceptableAbsenceCountMock = getUnacceptableAbsenceCount as jest.Mock

  it('On error - Calls next with error', async () => {
    getUnacceptableAbsenceCountMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getUnacceptableAbsenceCountMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.unacceptableAbsenceCount).toEqual({
      acceptableAbsence: 0,
      unacceptableAbsence: 2,
      total: 4,
    })

    expect(next).toHaveBeenCalledWith()
  })
})
