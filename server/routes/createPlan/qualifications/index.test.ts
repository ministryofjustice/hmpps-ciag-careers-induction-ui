import { Router } from 'express'
import Controller from './qualificationsController'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getLatestAssessmentResolver from '../../../middleware/resolvers/getLatestAssessmentResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./qualificationsController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getLatestAssessmentResolver')
jest.mock('../../../middleware/parseCheckBoxValue')

describe('Qualifications routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerSearchService: {},
      curiousEsweService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getLatestAssessmentResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(parseCheckBoxValue as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for new status page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/plan/create/:id/qualifications-list/:mode',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getLatestAssessmentResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for new status page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/plan/create/:id/qualifications-list/:mode',
      [
        expect.any(Function), // getPrisonerByIdResolver
      ],
      expect.any(Function), // controller.post
    )
  })
})
