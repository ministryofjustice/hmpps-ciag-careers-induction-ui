import createError from 'http-errors'
import { NextFunction, Response, Request } from 'express'
import { SessionData } from 'express-session'
import { CiagService } from '../services'
import retrieveInduction from './routerRequestHandlers'

describe('routerRequestHandlers', () => {
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
    const ciagService = {
      getCiagPlan: jest.fn(),
    }

    const requestHandler = retrieveInduction(ciagService as unknown as CiagService)

    it('should retrieve Induction given induction exists', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.id = prisonNumber

      const userToken = 'a-user-token'
      res.locals.user.token = userToken

      const induction = {
        plan: {
          prisonerNumber: prisonNumber,
        },
      }
      ciagService.getCiagPlan.mockResolvedValue(induction)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(ciagService.getCiagPlan).toHaveBeenCalledWith(userToken, prisonNumber)
      expect(req.context.plan).toEqual(induction)
      expect(next).toHaveBeenCalled()
    })

    it('should call next function with error given retrieving Induction fails with a 404', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.id = prisonNumber

      const userToken = 'a-user-token'
      res.locals.user.token = userToken

      ciagService.getCiagPlan.mockRejectedValue(createError(404, 'Not Found'))
      const expectedError = createError(404, `Induction for Prisoner ${prisonNumber} not returned by the Induction API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(ciagService.getCiagPlan).toHaveBeenCalledWith(userToken, prisonNumber)
      expect(req.context.plan).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should call next function with error given retrieving Induction fails with a 500', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.id = prisonNumber

      const userToken = 'a-user-token'
      res.locals.user.token = userToken

      ciagService.getCiagPlan.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(500, `Induction for Prisoner ${prisonNumber} not returned by the Induction API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(ciagService.getCiagPlan).toHaveBeenCalledWith(userToken, prisonNumber)
      expect(req.context.plan).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })
})
