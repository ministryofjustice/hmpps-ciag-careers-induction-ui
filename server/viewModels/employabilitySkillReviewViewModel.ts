import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/utils'

@Exclude()
export default class EmployabilitySkillReviewViewModel {
  @Expose()
  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  reviewDate: string

  @Expose()
  currentProgression: string
}
