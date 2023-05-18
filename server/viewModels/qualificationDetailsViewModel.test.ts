import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import QualificationDetailsViewModel from './qualificationDetailsViewModel'

describe('QualificationDetailsViewModel', () => {
  const qualificationDetailsJson = {
    assessmentDate: '2022-05-01T00:00:00Z',
    qualificationGrade: 'A',
    qualificationType: 'Degree',
  }

  it('transforms JSON to QualificationDetailsViewModel instance', () => {
    const qualificationDetailsViewModel = plainToClass(QualificationDetailsViewModel, qualificationDetailsJson)

    expect(qualificationDetailsViewModel.assessmentDate).toBe('01 May 2022')
    expect(qualificationDetailsViewModel.qualificationGrade).toBe(qualificationDetailsJson.qualificationGrade)
    expect(qualificationDetailsViewModel.qualificationType).toBe(qualificationDetailsJson.qualificationType)
  })
})
