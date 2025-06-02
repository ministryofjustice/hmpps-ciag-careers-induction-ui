/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import populateCurrentUser from './populateCurrentUser'
import UserService from '../services/userService'

jest.mock('../services/userService')
jest.mock('../../logger')

describe('populateCurrentUser middleware', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  const nextFunction = jest.fn()
  let mockedUserService: jest.Mocked<UserService>

  beforeEach(() => {
    mockedUserService = {
      getUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>
    ;(UserService as any).mockImplementation(() => mockedUserService)

    mockReq = {}
    mockRes = {
      locals: {
        user: {
          token: '123',
          username: 'testuser',
        },
      },
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call next function when no user is provided', async () => {
    mockRes.locals.user = undefined

    await populateCurrentUser(mockedUserService as any)(mockReq as Request, mockRes as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
  })

  it('should populate user when valid token is provided', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
    }
    mockedUserService.getUser.mockResolvedValue(mockUser as any)

    await populateCurrentUser(mockedUserService as any)(mockReq as Request, mockRes as Response, nextFunction)

    expect(mockRes.locals.user).toEqual(expect.objectContaining(mockUser))
    expect(nextFunction).toHaveBeenCalled()
  })

  it('should log error and call next function when failed to retrieve user', async () => {
    mockedUserService.getUser.mockRejectedValue(new Error('Failed to get user'))

    await populateCurrentUser(mockedUserService as any)(mockReq as Request, mockRes as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(new Error('Failed to get user'))
  })
})
