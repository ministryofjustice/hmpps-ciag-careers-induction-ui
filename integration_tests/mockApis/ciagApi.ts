import { stubFor } from './wiremock'

const getCiagPlan = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: id,
      },
    },
  })

export default {
  getCiagPlan,
}
