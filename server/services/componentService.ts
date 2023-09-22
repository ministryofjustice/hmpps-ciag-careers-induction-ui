import FrontendComponentsApiClient from '../data/componentsApi/componentsApiClient'
import AvailableComponents from '../data/componentsApi/types/availableComponents'

export default class ComponentService {
  async getComponents(components: AvailableComponents[], userToken: string) {
    // Get frontend components
    const frontentComponents = await new FrontendComponentsApiClient(userToken).getComponents(components)

    return frontentComponents
  }
}
