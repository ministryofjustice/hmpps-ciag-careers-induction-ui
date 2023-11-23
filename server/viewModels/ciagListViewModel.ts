// Required import for jest
import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'

import { convertToTitleCase, formatDateStringToddMMMyyyy } from '../utils/utils'

// Exclude all by default expose properties when needed
@Exclude()
export default class CiagListViewModel {
  @Expose()
  prisonerNumber: string

  pncNumber: string

  pncNumberCanonicalShort: string

  pncNumberCanonicalLong: string

  croNumber: string

  bookingId: string

  bookNumber: string

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  firstName: string

  middleNames: string

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  lastName: string

  dateOfBirth: string

  gender: string

  ethnicity: string

  youthOffender: boolean

  maritalStatus: string

  religion: string

  nationality: string

  status: string

  lastMovementTypeCode: string

  lastMovementReasonCode: string

  inOutStatus: string

  prisonId: string

  prisonName: string

  cellLocation: string

  aliases: [
    {
      firstName: string
      middleNames: string
      lastName: string
      dateOfBirth: string
      gender: string
      ethnicity: string
    },
  ]

  alerts: [
    {
      alertType: string
      alertCode: string
      active: boolean
      expired: boolean
    },
  ]

  csra: string

  category: string

  legalStatus: string

  imprisonmentStatus: string

  imprisonmentStatusDescription: string

  mostSeriousOffence: string

  recall: boolean

  indeterminateSentence: boolean

  sentenceStartDate: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  releaseDate: string

  confirmedReleaseDate: string

  sentenceExpiryDate: string

  licenceExpiryDate: string

  homeDetentionCurfewEligibilityDate: string

  homeDetentionCurfewActualDate: string

  homeDetentionCurfewEndDate: string

  topupSupervisionStartDate: string

  topupSupervisionExpiryDate: string

  additionalDaysAwarded: number

  nonDtoReleaseDate: string

  @Expose()
  nonDtoReleaseDateType: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  receptionDate: string

  paroleEligibilityDate: string

  automaticReleaseDate: string

  postRecallReleaseDate: string

  conditionalReleaseDate: string

  actualParoleDate: string

  tariffDate: string

  locationDescription: string

  restrictedPatient: boolean

  supportingPrisonId: string

  dischargedHospitalId: string

  dischargedHospitalDescription: string

  dischargeDate: string

  dischargeDetails: string

  ciagStatus?: string
}
