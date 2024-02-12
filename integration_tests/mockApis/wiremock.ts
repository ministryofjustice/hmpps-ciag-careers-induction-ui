import superagent, { SuperAgentRequest, Response } from 'superagent'

const url = 'http://localhost:9091/__admin'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = body => superagent.post(`${url}/requests/find`).send(body)

const getMatchingRequestBody = <BODY>(method: string, urlPattern: string): Promise<BODY> =>
  getMatchingRequests({
    method,
    urlPattern,
  }).then(data => {
    const { requests } = JSON.parse(data.text)
    return JSON.parse(requests[0].body)
  })

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

export { stubFor, getMatchingRequests, getMatchingRequestBody, resetStubs }
