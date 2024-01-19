import config from '../config'

import { HmppsAuthClient } from '../data'
import clientFactory from '../data/oauthEnabledClient'
import CuriousApi from '../data/curious/curiousApi'
import { LearnerLatestAssessment } from '../data/curious/types/Types'
import log from '../log'

const curiousApi = CuriousApi.create(clientFactory({ baseUrl: config.apis.curiousApi.url }))

export default class CuriousEsweService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

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
}
