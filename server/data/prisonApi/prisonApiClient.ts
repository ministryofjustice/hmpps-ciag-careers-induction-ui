import type { Readable } from 'stream'

import config from '../../config'
import logger from '../../log'
import RestClient from '../restClient'
import GetOffenderActivitiesResponse from './getOffenderActivitiesResponse'

export interface Prison {
  agencyId: string
  description: string
  agencyType?: string
  active?: boolean
}

export interface PrisonerMovement {
  fromAgency: string
  fromAgencyDescription: string
  fromCity: string
  directionCode: string
  movementDate: string
  movementReason: string
  movementType: string
  movementTypeDescription: string
  toAgency: string
  toAgencyDescription: string
  toCity: string
}

export default class PrisonApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prison API', config.apis.hmppsPrisonApi, token)
  }

  async getPrisonerImage(prisonerNumber: string): Promise<Readable> {
    return this.restClient.stream({
      path: `/api/bookings/offenderNo/${prisonerNumber}/image/data`,
      errorLogger: error =>
        error.status === 404
          ? logger.info(`No prisoner image available for prisonerNumber: ${prisonerNumber}`)
          : this.restClient.defaultErrorLogger(error),
    }) as Promise<Readable>
  }

  async getLastMovement(prisonerNumber: string): Promise<PrisonerMovement[]> {
    return this.restClient.post({
      path: `/api/movements/offenders?latestOnly=true&movementTypes=REL&movementTypes=TRN`,
      data: [prisonerNumber],
    })
  }

  getPrisons(): Promise<Prison[]> {
    return this.restClient.get<Prison[]>({
      path: `/api/agencies/type/INST`,
    })
  }

  async getPrison(prisonId: string): Promise<Prison> {
    return this.restClient.get<Prison>({
      path: `/api/agencies/${prisonId}`,
    })
  }

  async getAllOffenderActivities(offenderId: string): Promise<GetOffenderActivitiesResponse> {
    return this.restClient.get<GetOffenderActivitiesResponse>({
      path: `/api/offender-activities/${offenderId}/activities-history?earliestEndDate=1922-10-01&page=0&size=9999`,
    })
  }
}
