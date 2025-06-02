import { Request, Response } from 'express'
import handleSortMiddleware from './handleSortMiddleware'
import { buildSortUrl, SortOrder } from '../utils/columnSort'

describe('#handleSortMiddleware', () => {
  const formFieldName = 'sortField'
  const defaultSort = 'createdAt'
  const defaultOrder = SortOrder.ascending

  const mockReq: Request = {
    body: {},
    query: {},
    originalUrl: '/',
  } as Request

  const mockRes: Response = {
    redirect: jest.fn(),
  } as unknown as Response

  const mockNext = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('success - should call next() if formFieldName is not in req.body', () => {
    handleSortMiddleware(formFieldName, defaultSort, defaultOrder)(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockRes.redirect).not.toHaveBeenCalled()
  })

  it('success - should redirect to sorted URL if formFieldName is in req.body', () => {
    const sortField = 'updatedAt'
    mockReq.body[formFieldName] = sortField

    handleSortMiddleware(formFieldName, defaultSort, defaultOrder)(mockReq, mockRes, mockNext)

    expect(mockRes.redirect).toHaveBeenCalledTimes(1)
    expect(mockRes.redirect).toHaveBeenCalledWith(
      buildSortUrl({
        query: mockReq.query,
        sortField,
        currentUrl: mockReq.originalUrl,
        defaultSort,
        defaultOrder,
      }),
    )
    expect(mockNext).not.toHaveBeenCalled()
  })
})
