import { Router } from 'express'
import Controller from './ciagListController'
import getCiagListResolver from '../../middleware/resolvers/getCiagListResolver'
import { Services } from '../../services'
import routes from './index'

jest.mock('./ciagListController')
jest.mock('../../middleware/resolvers/getCiagListResolver')

describe('Ciag data routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getCiagListResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for Ciag list page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/',
      [
        expect.any(Function), // getCiagListResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for Ciag list page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/',
      [
        expect.any(Function), // getCiagListResolver
      ],
      expect.any(Function), // controller.post
    )
  })
})
