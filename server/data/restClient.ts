import superagent, { SuperAgentRequest } from 'superagent'
import Agent, { HttpsAgent } from 'agentkeepalive'
import { Readable } from 'stream'

import logger from '../log'
import type { UnsanitisedError } from '../sanitisedError'
import sanitiseError from '../sanitisedError'
import { ApiConfig } from '../config'

interface PutPostRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: unknown
}

interface GetDeleteRequest {
  path?: string
  query?: string
  headers?: Record<string, string>
  responseType?: string
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
}

export default class RestClient {
  agent: Agent

  constructor(private readonly name: string, private readonly config: ApiConfig, private readonly token: string) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  defaultErrorLogger(error: UnsanitisedError): void {
    logger.warn(sanitiseError(error), `Error calling ${this.name}`)
  }

  async get<T>({ path = null, query = '', headers = {}, responseType = '' }: GetDeleteRequest = {}): Promise<T> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path} ${query}`)
    return this.getOrDelete('GET', superagent.get, { path, query, headers, responseType })
  }

  async put<T>({ path = null, headers = {}, responseType = '', data = {} }: PutPostRequest = {}): Promise<T> {
    logger.info(`Put using user credentials: calling ${this.name}: ${path}`)
    return this.putOrPost('PUT', superagent.put, { path, headers, responseType, data })
  }

  async post<T>({ path = null, headers = {}, responseType = '', data = {} }: PutPostRequest = {}): Promise<T> {
    logger.info(`Post using user credentials: calling ${this.name}: ${path}`)
    return this.putOrPost('POST', superagent.post, { path, headers, responseType, data })
  }

  async delete<T>({ path = null, query = '', headers = {}, responseType = '' }: GetDeleteRequest = {}): Promise<T> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path} ${query}`)
    return this.getOrDelete('DELETE', superagent.delete, { path, headers, responseType })
  }

  private async putOrPost<T>(
    verb: string,
    method: (url: string) => SuperAgentRequest,
    { path = null, headers = {}, responseType = '', data = {} } = {},
  ): Promise<T> {
    try {
      const result = await method(`${this.apiUrl()}${path}`)
        .send(data)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: '${verb}'`)
      throw sanitisedError
    }
  }

  async getOrDelete<T>(
    verb: string,
    method: (url: string) => SuperAgentRequest,
    { path = null, query = '', headers = {}, responseType = '' } = {},
  ): Promise<T> {
    try {
      const result = await method(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .auth(this.token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(this.timeoutConfig())

      return result.body
    } catch (error) {
      const sanitisedError = sanitiseError(error)
      logger.warn({ ...sanitisedError, query }, `Error calling ${this.name}, path: '${path}', verb: '${verb}'`)
      throw sanitisedError
    }
  }

  async stream({
    path = null,
    headers = {},
    errorLogger = this.defaultErrorLogger,
  }: StreamRequest = {}): Promise<Readable> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path}`)
    return new Promise((resolve, reject) => {
      superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .auth(this.token, { type: 'bearer' })
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout(this.timeoutConfig())
        .set(headers)
        .end((error, response) => {
          if (error) {
            errorLogger(error)
            reject(error)
          } else if (response) {
            const s = new Readable()
            // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-empty-function
            s._read = () => {}
            s.push(response.body)
            s.push(null)
            resolve(s)
          }
        })
    })
  }
}
