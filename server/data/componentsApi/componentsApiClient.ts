import config from '../../config'
import LegacyRestClient from '../legacyRestClient'
import Component from './interfaces/component'
import AvailableComponent from './types/availableComponents'

export default class ComponentsApiClient {
  restClient: LegacyRestClient

  userToken: string

  constructor(token: string) {
    this.restClient = new LegacyRestClient('Frontend components API', config.apis.frontendComponents, token)
    this.userToken = token
  }

  async getComponents<T extends AvailableComponent[]>(components: T): Promise<Record<T[number], Component>> {
    return this.restClient.get({
      path: `/components`,
      query: `component=${components.join('&component=')}`,
      headers: { 'x-user-token': this.userToken },
    })
  }
}
