import 'reflect-metadata'
import { Exclude, Expose, Type } from 'class-transformer'
import QualificationDetailsViewModel from './qualificationDetailsViewModel'

@Exclude()
export default class QualificationViewModel {
  establishmentId: string

  establishmentName: string

  @Expose()
  @Type(() => QualificationDetailsViewModel)
  qualification?: QualificationDetailsViewModel
}
