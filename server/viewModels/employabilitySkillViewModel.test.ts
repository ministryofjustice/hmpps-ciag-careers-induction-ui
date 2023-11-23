import { plainToClass } from 'class-transformer'
import EmployabilitySkillReviewViewModel from './employabilitySkillReviewViewModel'
import EmployabilitySkillViewModel from './employabilitySkillViewModel'

const testData: any = {
  prn: 'A123456',
  employabilitySkill: 'Basic Literacy',
  reviews: [
    {
      reviewDate: '2023-10-04',
      reviewProgress: 'Good',
      reviewComments: 'The participant is making good progress with this skill.',
    },
    {
      reviewDate: '2023-11-23',
      reviewProgress: 'Excellent',
      reviewComments: 'The participant has mastered this skill and is now ready to move on to the next level.',
    },
  ],
}

describe('EmployabilitySkillReviewViewModel', () => {
  it('should expose only expected properties', () => {
    const employabilitySkillViewModel: EmployabilitySkillViewModel = plainToClass(EmployabilitySkillViewModel, testData)
    expect(Object.keys(employabilitySkillViewModel)).toEqual(['employabilitySkill', 'reviews'])
  })

  it('should convert reviews to instances of EmployabilitySkillReviewViewModel', () => {
    const employabilitySkillViewModel: EmployabilitySkillViewModel = plainToClass(EmployabilitySkillViewModel, testData)
    expect(employabilitySkillViewModel.reviews[0] instanceof EmployabilitySkillReviewViewModel).toBeTruthy()
    expect(employabilitySkillViewModel.reviews[1] instanceof EmployabilitySkillReviewViewModel).toBeTruthy()
  })
})
