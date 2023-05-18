import 'reflect-metadata'
import { Exclude, Expose, Type } from 'class-transformer'
import EmployabilitySkillReviewViewModel from './employabilitySkillReviewViewModel'

@Exclude()
export default class EmployabilitySkillViewModel {
  prn: string

  establishmentId: string

  establishmentName: string

  @Expose()
  employabilitySkill: string

  activityStartDate: string

  activityEndDate: string

  deliveryLocationPostCode: string

  deliveryMethodType: string

  activityLocation: string

  @Expose()
  @Type(() => EmployabilitySkillReviewViewModel)
  reviews: EmployabilitySkillReviewViewModel[]
}
