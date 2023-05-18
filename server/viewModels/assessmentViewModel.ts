import 'reflect-metadata'
import { Exclude, Expose, Type } from 'class-transformer'
import QualificationViewModel from './qualificationViewModel'

@Exclude()
export default class AssessmentViewModel {
  prn: string

  @Expose()
  @Type(() => QualificationViewModel)
  qualifications?: QualificationViewModel[]
}
