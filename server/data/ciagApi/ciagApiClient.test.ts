/* eslint-disable @typescript-eslint/no-explicit-any */
import CiagApiClient from './ciagApiClient'
import RestClient from '../restClient'

// Mock the RestClient module
jest.mock('../restClient')

describe('CiagApiClient', () => {
  let ciagApiClient: CiagApiClient
  let restClientMock: jest.Mocked<RestClient>

  beforeEach(() => {
    restClientMock = new RestClient('mock_name', {} as any, 'mock_token') as jest.Mocked<RestClient>
    ciagApiClient = new CiagApiClient('dummyToken')
    ciagApiClient.restClient = restClientMock
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should get CiagPlan', async () => {
    // Mock RestClient's get method
    restClientMock.get.mockResolvedValue({
      /* mock CiagPlan data */
    })

    const result = await ciagApiClient.getCiagPlan('offenderId')

    expect(result).toBeDefined()
  })

  it('should create CiagPlan', async () => {
    // Mock RestClient's post method
    restClientMock.post.mockResolvedValue({
      /* mock CiagPlan data */
    })

    const result = await ciagApiClient.createCiagPlan('offenderId', {
      /* newPlan data */
    } as any)

    expect(result).toBeDefined()
  })

  it('should update CiagPlan', async () => {
    // Mock RestClient's put method
    restClientMock.put.mockResolvedValue({
      /* mock CiagPlan data */
    })

    const result = await ciagApiClient.updateCiagPlan('offenderId', {
      /* updatedPlan data */
    } as any)

    expect(result).toBeDefined()
  })

  it('should delete CiagPlan', async () => {
    // Mock RestClient's delete method
    restClientMock.delete.mockResolvedValue({
      /* mock CiagPlan data */
    })

    const result = await ciagApiClient.deleteCiagPlan('offenderId')

    expect(result).toBeDefined()
  })
})
