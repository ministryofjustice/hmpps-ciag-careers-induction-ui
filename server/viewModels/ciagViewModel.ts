// Required import for jest
import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { convertToTitleCase, formatDateStringToddMMMyyyy } from '../utils/utils'
import PageableResponse from '../data/domain/types/pagedResponse'

// Exclude all by default expose properties when needed
@Exclude()
export default class CiagViewModel {
  @Expose()
  prisonerNumber: string

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  firstName: string

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  lastName: string

  sentenceStartDate: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  releaseDate: string

  nonDtoReleaseDate: string

  @Expose()
  nonDtoReleaseDateType: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  receptionDate: string

  @Expose()
  cellLocation: string

  @Expose()
  status: string
}

export type PagedCiagResponse = PageableResponse<CiagViewModel>
