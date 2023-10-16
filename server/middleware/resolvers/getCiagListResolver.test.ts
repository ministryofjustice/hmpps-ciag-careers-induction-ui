/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getCiagListResolver'

describe('getCiagListResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { activeCaseload: { caseLoadId: 'MDI' } }

  const mockData = {
    prisonerSearchResults: {
      content: [
        {
          prisonerNumber: 'A0670DZ',
          firstName: 'mock_firstName',
          lastName: 'mock_lastName',
          releaseDate: 'mock_releaseDate',
          nonDtoReleaseDate: 'mock_nonDtoReleaseDate',
          nonDtoReleaseDateType: 'mock_nonDtoReleaseType',
          receptionDate: 'mock_receptionDate',
        },
      ],
    },
    getCiagListResults: {
      ciagProfileList: [
        {
          offenderId: 'A1234BC',
          createdDateTime: '2024-12-19',
        },
      ],
    },
    getActionPlanListResults: {
      actionPlanSummaries: [
        {
          prisonNumber: 'A1234BC',
        },
      ],
    },
  }

  const serviceMock1 = {
    getPrisonersByCaseloadID: jest.fn(),
  }
  const serviceMock2 = {
    getCiagPlanList: jest.fn(),
  }
  const serviceMock3 = {
    getActionPlanList: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock1 as any, serviceMock2 as any, serviceMock3 as any)

  it('On error - calls next with error', async () => {
    serviceMock1.getPrisonersByCaseloadID.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - attaches data to context and clls next', async () => {
    serviceMock1.getPrisonersByCaseloadID.mockResolvedValue(mockData.prisonerSearchResults)
    serviceMock2.getCiagPlanList.mockResolvedValue(mockData.getCiagListResults)
    serviceMock3.getActionPlanList.mockResolvedValue(mockData.getActionPlanListResults)

    await resolver(req, res, next)

    expect(req.context.ciagList).toEqual({
      content: [
        {
          prisonerNumber: 'A0670DZ',
          firstName: 'mock_firstName',
          lastName: 'mock_lastName',
          releaseDate: 'mock_releaseDate',
          nonDtoReleaseDate: 'mock_nonDtoReleaseDate',
          nonDtoReleaseDateType: 'mock_nonDtoReleaseType',
          receptionDate: 'mock_receptionDate',
          ciagStatus: 'NEEDS_PLAN',
          ciagPlanComplete: false,
        },
      ],
    })

    expect(next).toHaveBeenCalledWith()
  })
})
