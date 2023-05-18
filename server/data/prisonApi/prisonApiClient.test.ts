import 'reflect-metadata'
import nock from 'nock'
import config from '../../config'
import logger from '../../log'
import PrisonApiClient from './prisonApiClient'

jest.mock('../../log')

describe('prisonApiClient', () => {
  let fakePrisonApi: nock.Scope
  let client: PrisonApiClient

  const token = 'token-1'

  beforeEach(() => {
    fakePrisonApi = nock(config.apis.hmppsPrisonApi.url)
    client = new PrisonApiClient(token)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getImage', () => {
    it('should return image data from api', async () => {
      fakePrisonApi
        .get(`/api/bookings/offenderNo/A1234AA/image/data`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, 'image data', { 'Content-Type': 'image/jpeg' })

      const response = await client.getPrisonerImage('A1234AA')

      expect(response.read()).toEqual(Buffer.from('image data'))
    })

    it('should log at only info level for 404s', async () => {
      fakePrisonApi
        .get(`/api/bookings/offenderNo/A1234AA/image/data`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(404)

      expect.assertions(3)

      await expect(client.getPrisonerImage('A1234AA')).rejects.toEqual(new Error('Not Found'))

      expect(logger.info).toHaveBeenCalled()
      expect(logger.warn).not.toHaveBeenCalled()
    })
  })
})
