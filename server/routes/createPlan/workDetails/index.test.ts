import { Router } from 'express'
import Controller from './workDetailsController'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import { Services } from '../../../services'
import routes from './index'
import checkSessionPageData from '../../../middleware/checkSessionPageData'

jest.mock('./workDetailsController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/parseCheckBoxValue')
jest.mock('../../../middleware/checkSessionPageData')

describe('Work details routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerplanService: {},
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(parseCheckBoxValue as jest.Mock).mockImplementation(() => jest.fn())
    ;(checkSessionPageData as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for the page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/plan/create/:id/work-details/:typeOfWorkExperienceKey/:mode',
      [
        expect.any(Function), // getPrisonerByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for the page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/plan/create/:id/work-details/:typeOfWorkExperienceKey/:mode',
      [
        expect.any(Function), // checkSessionPageData
        expect.any(Function), // getPrisonerByIdResolver
      ],
      expect.any(Function), // controller.post
    )
  })
})
