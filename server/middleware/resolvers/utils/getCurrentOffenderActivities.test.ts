/* eslint-disable @typescript-eslint/no-explicit-any */
import getCurrentOffenderActivities from './getCurrentOffenderActivities'

describe('getCurrentOffenderActivities', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    content: [
      {
        bookingId: 1102484,
        agencyLocationId: 'MDI',
        agencyLocationDescription: 'Moorland (HMP & YOI)',
        description: 'Braille am',
        startDate: '2021-10-07',
        endDate: '2022-01-27',
        isCurrentActivity: true,
      },
      {
        bookingId: 1102484,
        agencyLocationId: 'MDI',
        agencyLocationDescription: 'Moorland (HMP & YOI)',
        description: 'Braille am',
        startDate: '2021-10-07',
        endDate: '2022-01-27',
        isCurrentActivity: false,
      },
    ],
  }

  const serviceMock = {
    getAllOffenderActivities: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getAllOffenderActivities.mockRejectedValue(error)

    try {
      await getCurrentOffenderActivities(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getAllOffenderActivities.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    const result = await getCurrentOffenderActivities(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getAllOffenderActivities.mockResolvedValue(mockData)

    const result = await getCurrentOffenderActivities(serviceMock as any, username, id)

    expect(result).toEqual([
      {
        bookingId: 1102484,
        agencyLocationId: 'MDI',
        agencyLocationDescription: 'Moorland (HMP & YOI)',
        description: 'Braille am',
        startDate: '2021-10-07',
        endDate: '2022-01-27',
        isCurrentActivity: true,
      },
    ])
  })
})
