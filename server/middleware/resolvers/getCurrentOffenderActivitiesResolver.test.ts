/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getCurrentOffenderActivitiesResolver'
import getCurrentOffenderActivities from './utils/getCurrentOffenderActivities'

jest.mock('./utils/getCurrentOffenderActivities', () => ({
  ...jest.requireActual('./utils/getCurrentOffenderActivities'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getCurrentOffenderActivitiesResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = [
    {
      bookingId: 1102484,
      agencyLocationId: 'MDI',
      agencyLocationDescription: 'Moorland (HMP & YOI)',
      description: 'Braille am',
      startDate: '2021-10-07',
      endDate: '2022-01-27',
      isCurrentActivity: true,
    },
  ]

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getCurrentOffenderActivitiesMock = getCurrentOffenderActivities as jest.Mock

  it('On error - Calls next with error', async () => {
    getCurrentOffenderActivitiesMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getCurrentOffenderActivitiesMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.currentOffenderActivities).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
