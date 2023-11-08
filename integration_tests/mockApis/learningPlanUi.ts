import { stubFor } from './wiremock'

const learningPlanPage = (id = 'A3260DZ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/plan/${id}/view.*`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body><h1>Learning plan mock</h1></body></html>',
    },
  })

export default {
  learningPlanPage,
}
