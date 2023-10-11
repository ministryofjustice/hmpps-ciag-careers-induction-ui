import { stubFor } from './wiremock'

import plans from '../mockData/ciagPlanData'

const getCiagPlan = (id = 'G6115VJ') => stubFor(plans[id])

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

const getCiagPlanList = () =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/ciag-plans`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ciagPlans: [
          {
            offenderId: 'G0000OP',
            createdDateTime: '2023-02-20',
          },
          {
            offenderId: 'G0000QR',
            createdDateTime: '2023-02-25',
          },
          {
            offenderId: 'G0000ST',
            createdDateTime: '2023-03-01',
          },
          {
            offenderId: 'G0000AB',
            createdDateTime: '2023-01-24',
          },
        ],
      },
    },
  })

export default {
  getCiagPlan,
  createCiagPlan,
  updateCiagPlan,
  getCiagPlanList,
}
