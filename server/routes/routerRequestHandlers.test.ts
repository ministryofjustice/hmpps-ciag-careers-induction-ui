import createError from 'http-errors'
import { NextFunction, Response, Request } from 'express'
import { SessionData } from 'express-session'
import { InductionService } from '../services'
import retrieveInduction from './routerRequestHandlers'
import toCiagPlan from '../data/mappers/ciagPlanMapper'
import { aShortQuestionSetInductionDto } from '../testsupport/inductionDtoTestDataBuilder'
import { aShortQuestionSetCiagPlan } from '../testsupport/ciagPlanTestDataBuilder'

jest.mock('../data/mappers/ciagPlanMapper')

describe('routerRequestHandlers', () => {
  const ciagPlanMapperMock = toCiagPlan as jest.MockedFunction<typeof toCiagPlan>

  const req = {
    session: {} as SessionData,
    params: {} as Record<string, string>,
    query: {} as Record<string, string>,
    context: {} as Record<string, unknown>,
  }
  const res = {
    redirect: jest.fn(),
    locals: {
      user: {} as Express.User,
    },
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { user: {} as Express.User }
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
    req.query = {} as Record<string, string>
    req.context = {} as Record<string, unknown>
  })

  describe('retrieveInduction', () => {
    const inductionService = {
      getInduction: jest.fn(),
    }

    const requestHandler = retrieveInduction(inductionService as unknown as InductionService)

    it('should retrieve Induction given induction exists', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.id = prisonNumber

      const userToken = 'a-user-token'
      res.locals.user.token = userToken

      const inductionDto = aShortQuestionSetInductionDto({ prisonNumber })
      inductionService.getInduction.mockResolvedValue(inductionDto)

      const induction = aShortQuestionSetCiagPlan({ prisonNumber })
      ciagPlanMapperMock.mockReturnValue(induction)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(req.context.plan).toEqual(induction)
      expect(ciagPlanMapperMock).toHaveBeenCalledWith(inductionDto)
      expect(next).toHaveBeenCalled()
    })

    it('should call next function with error given retrieving Induction fails with a 404', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.id = prisonNumber

      const userToken = 'a-user-token'
      res.locals.user.token = userToken

      inductionService.getInduction.mockRejectedValue({
        status: 404,
        data: {
          status: 404,
          userMessage: `Induction not found for prisoner [${prisonNumber}]`,
          developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        },
      })
      const expectedError = createError(404, `Induction for Prisoner ${prisonNumber} not returned by the Induction API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(req.context.plan).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should call next function with error given retrieving Induction fails with a 500', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.id = prisonNumber

      const userToken = 'a-user-token'
      res.locals.user.token = userToken

      inductionService.getInduction.mockRejectedValue({
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      })
      const expectedError = createError(500, `Induction for Prisoner ${prisonNumber} not returned by the Induction API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(req.context.plan).toBeUndefined()
      expect(ciagPlanMapperMock).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })
})
