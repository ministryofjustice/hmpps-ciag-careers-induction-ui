import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import ActivityViewModel from './activityViewModel'

describe('ActivityViewModel', () => {
  const activityJson = {
    bookingId: 12345,
    agencyLocationId: 'AGENCY123',
    agencyLocationDescription: 'Agency Location',
    description: 'Activity Description',
    startDate: '2022-05-01T09:00:00Z',
    endDate: '2022-05-01T17:00:00Z',
    isCurrentActivity: true,
  }

  it('transforms JSON to ActivityViewModel instance', () => {
    const activityViewModel = plainToClass(ActivityViewModel, activityJson)

    // Excluded values
    expect(activityViewModel.bookingId).toBe(undefined)
    expect(activityViewModel.agencyLocationId).toBe(undefined)

    // Exposed values
    expect(activityViewModel.agencyLocationDescription).toBe(activityJson.agencyLocationDescription)
    expect(activityViewModel.description).toBe(activityJson.description)
    expect(activityViewModel.startDate).toBe('01 May 2022')
    expect(activityViewModel.endDate).toBe('01 May 2022')
    expect(activityViewModel.isCurrentActivity).toBe(activityJson.isCurrentActivity)
  })
})
