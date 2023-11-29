/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentsApiClient from './componentsApiClient'
import RestClient from '../restClient'

// Mock the RestClient module
jest.mock('../restClient')

describe('ComponentsApiClient', () => {
  let componentsApiClient: ComponentsApiClient
  let restClientMock: jest.Mocked<RestClient>

  beforeEach(() => {
    restClientMock = new RestClient('mock_name', {} as any, 'mock_token') as jest.Mocked<RestClient>
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
