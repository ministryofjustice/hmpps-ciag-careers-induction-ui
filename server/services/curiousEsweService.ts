import config from '../config'

import { HmppsAuthClient } from '../data'
import clientFactory from '../data/oauthEnabledClient'
import CuriousApi from '../data/curious/curiousApi'
import {
  LearnerLatestAssessment,
  LearnerNeurodivergence,
  LearnerEmployabilitySkills,
  LearnerEducation,
} from '../data/curious/types/Types'
import log from '../log'

const curiousApi = CuriousApi.create(clientFactory({ baseUrl: config.apis.curiousApi.url }))

export default class CuriousEsweService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getLearnerNeurodivergence(username: string, id: string): Promise<LearnerNeurodivergence[]> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(username),
        refresh_token: '',
      }

      const neurodivergence = await curiousApi.getLearnerNeurodivergence(systemToken, id)
      return neurodivergence
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no neurodivergence data for this prisoner: ${id.toUpperCase()}`)
        return []
      }
      log.error(`Failed to get neurodivergence details. Reason: ${e.message}`)
    }
    return null
  }

  async getLearnerEmployabilitySkills(username: string, id: string): Promise<LearnerEmployabilitySkills> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(username),
        refresh_token: '',
      }
      return await curiousApi.getLearnerEmployabilitySkillsRaw(systemToken, id)
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no employability skills data for this prisoner: ${id}`)
        return {}
      }
      log.error(`Failed to get learner employability skills. Reason: ${e.message}`)
    }
    return null
  }

  async getLearnerLatestAssessment(username: string, id: string): Promise<LearnerLatestAssessment[]> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(username),
        refresh_token: '',
      }

      return await curiousApi.getLearnerLatestAssessments(systemToken, id)
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no assessment data for this prisoner: ${id.toUpperCase()}`)
        return []
      }
      log.error(`Failed in get learner latest assessment. Reason: ${e.message}`)
    }
    return null
  }

  async getLearnerEducation(
    username: string,
    id: string,
    isCurrent?: boolean,
    establishmentId?: string,
  ): Promise<LearnerEducation> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(username),
        refresh_token: '',
      }

      return await curiousApi.getLearnerEducationRaw(systemToken, id, isCurrent, establishmentId)
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no education data for this prisoner: ${id.toUpperCase()}`)
        return {}
      }
      log.error(`Failed to get learner education data. Reason: ${e.message}`)
    }
    return null
  }
}
