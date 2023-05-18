/* eslint-disable @typescript-eslint/no-explicit-any */
import populateUserDetails from './populateUserDetails'
import UserService from '../services/userService'
import logger from '../log'

jest.mock('../log')
jest.mock('../services/userService')

describe('populateUserDetails middleware', () => {
  let mockedUserService: jest.Mocked<UserService>
  let req: any
  let res: any
  let next: any

  beforeEach(() => {
    mockedUserService = {
      getUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>
    ;(UserService as any).mockImplementation(() => mockedUserService)

    req = {}
    res = {
      locals: {},
      redirect: jest.fn(),
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call next if userDetails is already populated', async () => {
    // Arrange
    res.locals.user = { userDetails: {} }

    // Act
    await populateUserDetails(mockedUserService)(req, res, next)

    // Assert
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should set userDetails in res.locals and call next if user is found', async () => {
    // Arrange
    const mockUser = {
      username: 'testuser',
      email: 'testuser@example.com',
    }
    const mockUserDetails = {
      name: 'Test User',
      age: 30,
    }
    res.locals.user = mockUser
    mockedUserService.getUser.mockResolvedValue(mockUserDetails as any)

    // Act
    await populateUserDetails(mockedUserService)(req, res, next)

    // Assert
    expect(mockedUserService.getUser).toHaveBeenCalledWith(mockUser.username)
    expect(res.locals.user.userDetails).toEqual(mockUserDetails)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should log an error and redirect to /autherror if user details could not be retrieved', async () => {
    // Arrange
    const mockUser = {
      username: 'testuser',
      email: 'testuser@example.com',
    }
    res.locals.user = mockUser
    mockedUserService.getUser.mockResolvedValue(undefined)

    // Act
    await populateUserDetails(mockedUserService)(req, res, next)

    // Assert
    expect(mockedUserService.getUser).toHaveBeenCalledWith(mockUser.username)
    expect(logger.info).toHaveBeenCalledWith('User details could not be retrieved')
    expect(res.redirect).toHaveBeenCalledWith('/autherror')
    expect(next).not.toHaveBeenCalled()
  })

  it('should log an error and call next if an error occurs', async () => {
    // Arrange
    const mockUser = {
      username: 'testuser',
      email: 'testuser@example.com',
    }
    res.locals.user = mockUser
    const mockError = new Error('Failed to retrieve user details')
    mockedUserService.getUser.mockRejectedValue(mockError)

    // Act
    await populateUserDetails(mockedUserService)(req, res, next)

    // Assert
    expect(mockedUserService.getUser).toHaveBeenCalledWith(mockUser.username)
    expect(logger.error).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(mockError)
  })
})
