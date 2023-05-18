import HmppsAuthClient from '../data/hmppsAuthClient'
import WhereaboutsApiClient from '../data/whereaboutsApi/whereaboutsApiClient'
import GetUnacceptibleAbsenceCountResult from '../data/whereaboutsApi/getUnacceptibleAbsenceCountResult'

export default class WhereaboutsService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getUnacceptibleAbsenceCount(
    username: string,
    id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GetUnacceptibleAbsenceCountResult> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new WhereaboutsApiClient(systemToken).getUnacceptibleAbsenceCount(id, startDate, endDate)
  }
}
