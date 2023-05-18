import { plainToClass } from 'class-transformer'
import PrisonerViewModel from './prisonerViewModel'

describe('PrisonerViewModel', () => {
  const prisonerJson = {
    prisonerNumber: 'A1234BC',
    bookingId: '123456',
    firstName: 'john',
    lastName: 'doe',
    dateOfBirth: '1990-01-01T00:00:00Z',
    releaseDate: '2023-01-01T00:00:00Z',
  }

  it('transforms JSON to PrisonerViewModel instance', () => {
    const prisonerViewModel = plainToClass(PrisonerViewModel, prisonerJson)

    expect(prisonerViewModel.prisonerNumber).toBe(prisonerJson.prisonerNumber)
    expect(prisonerViewModel.bookingId).toBe(prisonerJson.bookingId)
    expect(prisonerViewModel.firstName).toBe('John')
    expect(prisonerViewModel.lastName).toBe('Doe')
    expect(prisonerViewModel.dateOfBirth).toBe('01 Jan 1990')
    expect(prisonerViewModel.releaseDate).toBe('01 Jan 2023')
  })
})
