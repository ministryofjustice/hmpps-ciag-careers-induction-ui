import { stubFor } from './wiremock'

const createCiagPlan = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/ciag/induction/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: id,
      },
    },
  })

const updateCiagPlan = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/ciag/induction/${id}`,
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
  createCiagPlan,
  updateCiagPlan,
}
