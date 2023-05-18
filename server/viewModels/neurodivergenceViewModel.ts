import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/utils'

@Exclude()
export default class NeurodivergenceViewModel {
  prn?: string

  establishmentId?: string

  establishmentName?: string

  @Expose()
  neurodivergenceSelfDeclared?: string[]

  @Expose()
  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  selfDeclaredDate?: string

  @Expose()
  neurodivergenceAssessed?: string[]

  @Expose()
  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  assessmentDate?: string

  @Expose()
  neurodivergenceSupport?: string[]

  @Expose()
  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  supportDate?: string
}
