import nock from 'nock'
import clientFactory from './oauthEnabledClient'
import contextProperties from './contextProperties'
import logger from '../log'

const hostname = 'http://localhost:8080'

describe('Test clients built by oauthEnabledClient', () => {
  it('should build something', () => {
    const client = clientFactory({ baseUrl: `${hostname}/`, timeout: 2000 })
    expect(client).not.toBeNull()
  })

  describe('Assert client behaviour', () => {
    const client = clientFactory({ baseUrl: `${hostname}/`, timeout: 2000 })
    const getRequest = nock(hostname)

    beforeEach(() => {
      getRequest.get('/api/users/me').reply(200, {})
    })

    afterEach(() => {
      nock.cleanAll()
    })

    it('Should set the authorization header with "Bearer <access token>"', async () => {
      const context = {}
      // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-named-as-default-member
      contextProperties.setTokens({ access_token: 'a', refresh_token: 'b' }, context)

      const response = await client.get(context, '/api/users/me')

      expect(response.status).toEqual(200)
      expect(response.req.getHeaders().authorization).toEqual('Bearer a')
    })

    it('Should succeed when there are no authorization headers', async () => {
      const response = await client.get({}, '/api/users/me')
      expect(response.req.getHeaders().authorization).toBeUndefined()
    })

    it('Should set the pagination headers on requests', async () => {
      const context = {}
      // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-named-as-default-member
      contextProperties.setRequestPagination(context, { 'page-offset': '0', 'page-limit': '10' })

      const response = await client.get(context, '/api/users/me')

      expect(response.req.getHeaders()).toEqual(expect.objectContaining({ 'page-offset': '0', 'page-limit': '10' }))
    })

    it('Should set the results limit header override on requests', async () => {
      const context = {}
      // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-named-as-default-member
      contextProperties.setRequestPagination(context, { 'page-offset': '0', 'page-limit': '10' })

      const response = await client.get(context, '/api/users/me', { resultsLimit: 500 })

      expect(response.req.getHeaders()).toEqual(expect.objectContaining({ 'page-offset': '0', 'page-limit': '500' }))
    })

    it('Should set custom headers on requests', async () => {
      const context = {}
      // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-named-as-default-member
      contextProperties.setCustomRequestHeaders(context, { 'custom-header': 'custom-value' })

      const response = await client.get(context, '/api/users/me')

      expect(response.req.getHeaders()).toEqual(expect.objectContaining({ 'custom-header': 'custom-value' }))
    })
  })

  describe('retry and timeout behaviour', () => {
    const client = clientFactory({ baseUrl: `${hostname}/`, timeout: 900 })
    const mock = nock(hostname)

    afterEach(() => {
      nock.cleanAll()
    })

    describe('get', () => {
      it('Should retry twice if request fails', async () => {
        mock
          .get('/api/users/me')
          .reply(500, { failure: 'one' })
          .get('/api/users/me')
          .reply(500, { failure: 'two' })
          .get('/api/users/me')
          .reply(200, { hi: 'bob' })

        const response = await client.get({}, '/api/users/me')
        expect(response.body).toEqual({ hi: 'bob' })
      })

      it('Should retry twice if request times out', async () => {
        mock
          .get('/api/users/me')
          .delay(10000) // delay set to 10s, timeout to 900/3=300ms
          .reply(200, { failure: 'one' })
          .get('/api/users/me')
          .delay(10000)
          .reply(200, { failure: 'two' })
          .get('/api/users/me')
          .reply(200, { hi: 'bob' })

        const response = await client.get({}, '/api/users/me')
        expect(response.body).toEqual({ hi: 'bob' })
      })

      it('Should fail if request times out three times', async () => {
        mock
          .get('/api/users/me')
          .delay(10000) // delay set to 10s, timeout to 900/3=300ms
          .reply(200, { failure: 'one' })
          .get('/api/users/me')
          .delay(10000)
          .reply(200, { failure: 'two' })
          .get('/api/users/me')
          .delay(10000)
          .reply(200, { failure: 'three' })

        await expect(client.get({}, '/api/users/me')).rejects.toThrow('Timeout of 300ms exceeded')
      })

      it('Should fail if request times out three with custom time out', async () => {
        mock
          .get('/api/users/me')
          .delay(200)
          .reply(200, { failure: 'one' })
          .get('/api/users/me')
          .delay(200)
          .reply(200, { failure: 'two' })
          .get('/api/users/me')
          .delay(200)
          .reply(200, { failure: 'three' })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await expect(client.getWithCustomTimeout({}, '/api/users/me', { customTimeout: 100 })).rejects.toThrow(
          'Timeout of 100ms exceeded',
        )
      })
    })

    describe('getStream', () => {
      it('Should retry twice if request fails', async () => {
        mock
          .get('/api/users/me')
          .reply(500, { failure: 'one' })
          .get('/api/users/me')
          .reply(500, { failure: 'two' })
          .get('/api/users/me')
          .reply(200, '{"hi":"bob"}', ['Content-Type', 'image/png'])

        const response = await client.getStream({}, '/api/users/me')
        expect(response.read().toString()).toEqual('{"hi":"bob"}')
      })

      it('Should retry twice if request times out', async () => {
        mock
          .get('/api/users/me')
          .delay(10000) // delay set to 10s, timeout to 900/3=300ms
          .reply(200, { failure: 'one' })
          .get('/api/users/me')
          .delay(10000)
          .reply(200, { failure: 'two' })
          .get('/api/users/me')
          .reply(200, '{"hi":"bob"}', ['Content-Type', 'image/png'])

        const response = await client.getStream({}, '/api/users/me')
        expect(response.read().toString()).toEqual('{"hi":"bob"}')
      })

      it('Should fail if request times out three times', async () => {
        mock
          .get('/api/users/me')
          .delay(10000) // delay set to 10s, timeout to 900/3=300ms
          .reply(200, { failure: 'one' })
          .get('/api/users/me')
          .delay(10000)
          .reply(200, { failure: 'two' })
          .get('/api/users/me')
          .delay(10000)
          .reply(200, { failure: 'three' })

        await expect(client.getStream({}, '/api/users/me')).rejects.toThrow('Timeout of 300ms exceeded')
      })
    })
  })

  describe('Normalise base url behaviour', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('Should set the url correctly if ends with a /', async () => {
      const client = clientFactory({ baseUrl: `${hostname}/`, timeout: 2000 })
      nock(hostname).get('/api/users/me').reply(200, {})

      const context = {}
      // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-named-as-default-member
      contextProperties.setTokens({ access_token: 'a', refresh_token: 'b' }, context)

      const path = '/api/users/me'
      const response = await client.get(context, path)

      expect(response.req.path).toEqual(path)
    })

    it("Should set the url correctly if doesn't end with a /", async () => {
      const client = clientFactory({ baseUrl: hostname, timeout: 2000 })
      nock(hostname).get('/api/users/me').reply(200, {})

      const context = {}
      // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/no-named-as-default-member
      contextProperties.setTokens({ access_token: 'a', refresh_token: 'b' }, context)

      const path = '/api/users/me'
      const response = await client.get(context, path)

      expect(response.req.path).toEqual(path)
    })
  })

  describe('Logging', () => {
    const client = clientFactory({ baseUrl: `${hostname}/`, timeout: 2000 })
    logger.warn = jest.fn()
    afterEach(() => {
      nock.cleanAll()
    })

    it('Should log 404 correctly', async () => {
      nock(hostname).get('/api/users/me').reply(404)

      await expect(client.get({}, '/api/users/me')).rejects.toThrow('Not Found')

      expect(logger.warn).toHaveBeenCalledWith('GET /api/users/me No record found')
    })

    it('Should log 500 correctly', async () => {
      nock(hostname).get('/api/users/me').reply(500).get('/api/users/me').reply(500).get('/api/users/me').reply(500)

      await expect(client.get({}, '/api/users/me')).rejects.toThrow('Internal Server Error')

      expect(logger.warn).toHaveBeenCalledWith('API error in GET /api/users/me 500 Internal Server Error {}')
    })
  })
})
