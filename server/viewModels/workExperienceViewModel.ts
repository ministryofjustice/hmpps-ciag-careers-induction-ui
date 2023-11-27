import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMM } from '../utils'

export default class WorkExperienceViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMM)
  modifiedDateTime: string

  workTypesOfInterest: string[]

  workTypesOfInterestOther: string

  particularJobInterests: string
}
