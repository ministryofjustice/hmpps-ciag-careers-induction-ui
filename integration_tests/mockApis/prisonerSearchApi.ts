import { stubFor } from './wiremock'
import prisoners from '../mockData/prisonerByIdData'
import ciagPrisoners from '../mockData/ciagListData'

const getPrisonerById = (id = 'G6115VJ') => stubFor(prisoners[id])

const getPrisonersByCaseloadId = (caseloadId: string) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/prisoner-search/prison/${caseloadId}?page=0&size=9999`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ...ciagPrisoners,
      },
    },
  })

export default {
  getPrisonerById,
  getPrisonersByCaseloadId,
}
