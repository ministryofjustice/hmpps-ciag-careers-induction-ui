/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import CiagViewModel from './ciagViewModel'

const testData: any = {
  prisonerNumber: 'A123456',
  firstName: 'john',
  lastName: 'doe',
  releaseDate: '2023-10-04',
  receptionDate: '2023-08-15',
  sentenceStartDate: '2023-08-15',
  nonDtoReleaseDate: '2024-08-15',
  nonDtoReleaseDateType: 'NCP',
}

describe('CiagViewModel', () => {
  const ciagViewModel: CiagViewModel = plainToClass(CiagViewModel, testData)

  it('should expose only specified properties', () => {
    expect(Object.keys(ciagViewModel)).toEqual([
      'prisonerNumber',
      'firstName',
      'lastName',
      'releaseDate',
      'nonDtoReleaseDateType',
      'receptionDate',
      'cellLocation',
      'status',
      'ciagStatus',
      'ciagPlanComplete',
    ])
  })

  it('should convert firstName and lastName to title case', () => {
    expect(ciagViewModel.firstName).toEqual('John')
    expect(ciagViewModel.lastName).toEqual('Doe')
  })

  it('should format releaseDate using formatDateStringToddMMMyyyy', () => {
    expect(ciagViewModel.releaseDate).toEqual('04 Oct 2023')
  })

  it('should format receptionDate using formatDateStringToddMMMyyyy', () => {
    expect(ciagViewModel.receptionDate).toEqual('15 Aug 2023')
  })
})
