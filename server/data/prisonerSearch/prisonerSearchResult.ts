import { Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../../utils/utils'

export default class PrisonerSearchResult {
  @Expose()
  prisonerNumber: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  displayName: string

  @Expose()
  prisonId: string

  @Expose()
  workTypeInterests: string

  @Expose()
  supportNeeded: string

  @Expose()
  noRightToWork: string

  @Expose()
  notStarted: string

  @Expose()
  supportDeclinedReasons: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  releaseDate: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  updatedOn: string

  @Expose()
  status: string

  @Expose()
  nonDtoReleaseDateType: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  nonDtoReleaseDate: string
}
