// eslint-disable-next-line max-classes-per-file
import { Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToyyyyMMdd } from '../../utils/utils'

export default class PrisonerProfileResult {
  @Expose()
  prisonerNumber: string

  @Expose()
  bookingId: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToyyyyMMdd)
  modifiedDate: string

  @Expose()
  status: string
}
