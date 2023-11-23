import { plainToClass } from 'class-transformer'
import CiagListViewModel from './ciagListViewModel'

const testData: any = {
  prisonerNumber: 'A123456',
  firstName: 'john',
  lastName: 'doe',
  releaseDate: '2023-10-04',
  receptionDate: '2023-08-15',
  conditionalReleaseDate: '2023-10-04',
}

describe('CiagListViewModel', () => {
  const ciagListViewModel: CiagListViewModel = plainToClass(CiagListViewModel, testData)

  it('should expose only specified properties', () => {
    expect(Object.keys(ciagListViewModel)).toEqual([
      'prisonerNumber',
      'firstName',
      'lastName',
      'releaseDate',
      'nonDtoReleaseDateType',
      'receptionDate',
    ])
  })

  it('should convert firstName and lastName to title case', () => {
    expect(ciagListViewModel.firstName).toEqual('John')
    expect(ciagListViewModel.lastName).toEqual('Doe')
  })

  it('should format releaseDate using formatDateStringToddMMMyyyy', () => {
    expect(ciagListViewModel.releaseDate).toEqual('04 Oct 2023')
  })

  it('should format receptionDate using formatDateStringToddMMMyyyy', () => {
    expect(ciagListViewModel.receptionDate).toEqual('15 Aug 2023')
  })
})
