import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import plans from '../mockData/ciagPlanData'

const getCiagPlan = (id = 'G6115VJ') => stubFor(plans[id])

const stubGetCiagPlan404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/induction/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
        developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        moreInfo: null,
      },
    },
  })

const stubGetCiagPlan500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/induction/${prisonNumber}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

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
  getCiagPlan,
  stubGetCiagPlan404Error,
  stubGetCiagPlan500Error,
  createCiagPlan,
  updateCiagPlan,
}
