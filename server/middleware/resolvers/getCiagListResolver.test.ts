/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getCiagListResolver'

describe('getCiagListResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { activeCaseload: { caseLoadId: 'MDI' } }

  const mockData = {
    prisonerSearchResults: {
      prisonerNumber: 'A0670DZ',
      firstName: 'mock_firstName',
      lastName: 'mock_lastName',
      releaseDate: 'mock_releaseDate',
      nonDtoReleaseDate: 'mock_nonDtoReleaseDate',
      nonDtoReleaseDateType: 'mock_nonDtoReleaseType',
      receptionDate: 'mock_receptionDate',
    },
  }

  const serviceMock = {
    getPrisonersByCaseloadID: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - calls next with error', async () => {
    serviceMock.getPrisonersByCaseloadID.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - attaches data to context and clls next', async () => {
    serviceMock.getPrisonersByCaseloadID.mockResolvedValue(mockData.prisonerSearchResults)

    await resolver(req, res, next)

    expect(req.context.ciagList).toEqual(mockData.prisonerSearchResults)

    expect(next).toHaveBeenCalledWith()
  })
})
