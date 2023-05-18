import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/utils'

@Exclude()
export default class QualificationDetailsViewModel {
  @Expose()
  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  assessmentDate?: string

  @Expose()
  qualificationGrade?: string

  @Expose()
  qualificationType?: string
}
