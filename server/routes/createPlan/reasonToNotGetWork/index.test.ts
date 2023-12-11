import { Router } from 'express'
import Controller from './reasonToNotGetWorkController'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getCiagPlanByIdResolver from '../../../middleware/resolvers/getCiagPlanByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import { Services } from '../../../services'
import routes from './index'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

jest.mock('./reasonToNotGetWorkController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getCiagPlanByIdResolver')
jest.mock('../../../middleware/parseCheckBoxValue')
jest.mock('../../../middleware/checkSessionPageData')

describe('Not hoping to get work routes', () => {
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
    ;(getCiagPlanByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(parseCheckBoxValue as jest.Mock).mockImplementation(() => jest.fn())
    ;(checkSessionPageData as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for the page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/plan/create/:id/reason-to-not-get-work/:mode',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getCiagPlanByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for the page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/plan/create/:id/reason-to-not-get-work/:mode',
      [
        expect.any(Function), // checkSessionPageData
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getCiagPlanByIdResolver
        expect.any(Function), // parseCheckBoxValue
      ],
      expect.any(Function), // controller.post
    )
  })
})
