import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import WorkExperienceViewModel from './workExperienceViewModel'

describe('WorkExperienceViewModel', () => {
  const workExperienceJson = {
    modifiedBy: 'test user',
    modifiedDateTime: '2022-03-01T12:30:00Z',
    workTypesOfInterest: ['IT', 'Sales'],
    workTypesOfInterestOther: 'Marketing',
    jobOfParticularInterest: 'Software Developer',
  }

  it('transforms JSON to WorkExperienceViewModel instance', () => {
    const workExperienceViewModel = plainToClass(WorkExperienceViewModel, workExperienceJson)

    expect(workExperienceViewModel.modifiedBy).toBe(workExperienceJson.modifiedBy)
    expect(workExperienceViewModel.modifiedDateTime).toBe('1 March')
    expect(workExperienceViewModel.workTypesOfInterest).toEqual(workExperienceJson.workTypesOfInterest)
    expect(workExperienceViewModel.workTypesOfInterestOther).toBe(workExperienceJson.workTypesOfInterestOther)
    expect(workExperienceViewModel.jobOfParticularInterest).toBe(workExperienceJson.jobOfParticularInterest)
  })
})
