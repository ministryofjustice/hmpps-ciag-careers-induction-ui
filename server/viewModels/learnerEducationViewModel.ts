import 'reflect-metadata'
import { Exclude, Expose, Transform } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/utils'

@Exclude()
export default class LearnerEducationViewModel {
  a2LevelIndicator?: boolean

  accessHEIndicator?: boolean

  actualGLH?: number

  aimSequenceNumber?: number

  alevelIndicator?: boolean

  asLevelIndicator?: boolean

  attendedGLH?: number

  completionStatus?: string

  courseCode?: string

  @Expose()
  courseName?: string

  deliveryLocationPostCode?: string

  deliveryMethodType?: string

  employmentOutcome?: string

  establishmentId?: string

  establishmentName?: string

  functionalSkillsIndicator?: boolean

  fundingAdjustmentPriorLearning?: number

  fundingModel?: string

  fundingType?: string

  gceIndicator?: boolean

  gcsIndicator?: boolean

  isAccredited?: boolean

  keySkillsIndicator?: boolean

  learnersAimType?: string

  learningActualEndDate?: string

  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  learningPlannedEndDate?: string

  learningStartDate?: string

  lrsGLH?: number

  miNotionalNVQLevelV2?: string

  occupationalIndicator?: boolean

  outcome?: string

  outcomeGrade?: string

  prisonWithdrawalReason?: string

  prn?: string

  qcfCertificateIndicator?: boolean

  qcfDiplomaIndicator?: boolean

  qcfIndicator?: boolean

  sectorSubjectAreaTier1?: string

  sectorSubjectAreaTier2?: string

  subcontractedPartnershipUKPRN?: number

  unitType?: string

  withdrawalReasonAgreed?: boolean

  withdrawalReasons?: string
}
