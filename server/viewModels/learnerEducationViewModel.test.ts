import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import LearnerEducationViewModel from './learnerEducationViewModel'

describe('LearnerEducationViewModel', () => {
  const learnerEducationJson = {
    courseName: 'Course Name',
    learningPlannedEndDate: '2022-05-01T09:00:00Z',
  }

  it('transforms JSON to LearnerEducationViewModel instance', () => {
    const learnerEducationViewModel = plainToClass(LearnerEducationViewModel, learnerEducationJson)

    expect(learnerEducationViewModel.courseName).toBe(learnerEducationJson.courseName)
    expect(learnerEducationViewModel.learningPlannedEndDate).toBe('01 May 2022')
  })
})
