import { stubFor } from './wiremock'

const getLearnerEducation = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/latestLearnerAssessments/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

export default { getLearnerEducation }
