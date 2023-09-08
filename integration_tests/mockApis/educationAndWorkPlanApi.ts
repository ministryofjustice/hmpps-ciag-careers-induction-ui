import { stubFor } from './wiremock'

const getActionPlanList = () =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/action-plans`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        actionPlanSummaries: [
          {
            reference: '123456',
            prisonNumber: 'G0000OP',
            reviewDate: '2023-02-20',
          },
          {
            reference: '123456',
            prisonNumber: 'G0000QR',
            reviewDate: '2023-02-25',
          },
          {
            reference: '123456',
            prisonNumber: 'G0000ST',
            reviewDate: '2023-03-01',
          },
          {
            reference: '123456',
            prisonNumber: 'G0000AB',
            reviewDate: '2023-01-24',
          },
        ],
      },
    },
  })

export default {
  getActionPlanList,
}
