/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import AssessmentViewModel from './assessmentViewModel'

describe('AssessmentViewModel', () => {
  const assessmentJson: any = {
    prn: '123456',
    qualifications: [
      {
        establishmentId: 'establishmentIdMock',
        establishmentName: 'establishmentNameMock',
        qualification: {
          assessmentDate: '2022-05-01T09:00:00Z',
          qualificationGrade: 'qualificationGradeMock',
          qualificationType: 'qualificationTypeMock',
        },
      },
    ],
  }

  it('transforms JSON to AssessmentViewModel instance', () => {
    const assessmentViewModel = plainToClass(AssessmentViewModel, assessmentJson)

    expect(assessmentViewModel.prn).toBe(undefined)
    expect(assessmentViewModel.qualifications).toBeInstanceOf(Array)
    expect(assessmentViewModel.qualifications).toEqual([
      {
        qualification: {
          assessmentDate: '01 May 2022',
          qualificationGrade: 'qualificationGradeMock',
          qualificationType: 'qualificationTypeMock',
        },
      },
    ])
  })
})
