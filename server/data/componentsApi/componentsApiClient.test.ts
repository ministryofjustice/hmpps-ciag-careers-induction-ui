/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentsApiClient from './componentsApiClient'
import LegacyRestClient from '../legacyRestClient'

// Mock the RestClient module
jest.mock('../legacyRestClient')

describe('ComponentsApiClient', () => {
  let componentsApiClient: ComponentsApiClient
  let restClientMock: jest.Mocked<LegacyRestClient>

  beforeEach(() => {
    restClientMock = new LegacyRestClient('mock_name', {} as any, 'mock_token') as jest.Mocked<LegacyRestClient>
    componentsApiClient = new ComponentsApiClient('dummyToken')
    componentsApiClient.restClient = restClientMock
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should get components', async () => {
    // Mock RestClient's get method
    const mockComponentsData = {
      component1: {
        /* mock component data */
      },
      component2: {
        /* mock component data */
      },
    }
    restClientMock.get.mockResolvedValue(mockComponentsData)

    const components = ['component1', 'component2']
    const result = await componentsApiClient.getComponents(components as any)

    expect(result).toEqual(mockComponentsData)
  })
})
