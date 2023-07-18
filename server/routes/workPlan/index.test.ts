import { Router } from 'express'
import Controller from './workPlanController'
import getPrisonerByIdResolver from '../../middleware/resolvers/getPrisonerByIdResolver'
import { Services } from '../../services'
import routes from './index'

jest.mock('./workPlanController')
jest.mock('../../middleware/resolvers/getPrisonerByIdResolver')

describe('Work plan routes', () => {
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
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for the page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/plan/:id/view/:tab',
      [
        expect.any(Function), // getPrisonerByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })
})
