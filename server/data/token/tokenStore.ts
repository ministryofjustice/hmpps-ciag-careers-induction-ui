import redis from 'redis'
import { promisify } from 'util'

import logger from '../../log'
import config from '../../config'

const createRedisClient = () => {
  return redis.createClient({
    // port: config.redis.port,
    password: config.redis.password,
    // host: config.redis.host,
    // tls: config.redis.tls_enabled ? {} : false,
    // prefix: 'systemToken:',
  })
}

export default class TokenStore {
  private getRedisAsync: (key: string) => Promise<string>

  private setRedisAsync: (key: string, value: string, mode: string, durationSeconds: number) => Promise<void>

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(redisClientFactory: () => redis.RedisClient = createRedisClient) {
    const redisClient = redisClientFactory()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    redisClient.on('error', error => {
      logger.error(error, `Redis error`)
    })

    this.getRedisAsync = promisify(redisClient.get).bind(redisClient)
    this.setRedisAsync = promisify(redisClient.set).bind(redisClient)
  }

  public async setToken(key: string, token: string, durationSeconds: number): Promise<void> {
    this.setRedisAsync(key, token, 'EX', durationSeconds)
  }

  public async getToken(key: string): Promise<string> {
    return this.getRedisAsync(key)
  }
}
