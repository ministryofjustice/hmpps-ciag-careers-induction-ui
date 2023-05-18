import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/utils'

@Exclude()
export default class ActivityViewModel {
  bookingId: number

  agencyLocationId: string

  @Expose()
  agencyLocationDescription: string

  @Expose()
  description: string

  @Expose()
  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  startDate: string

  @Expose()
  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  endDate: string

  @Expose()
  isCurrentActivity: boolean
}
