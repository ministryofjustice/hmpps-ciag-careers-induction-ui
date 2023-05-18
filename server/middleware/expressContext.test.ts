import { Request, Response } from 'express'
import expressContext from './expressContext'

describe('expressContext middleware', () => {
  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    req = {} as Request
    res = {} as Response
    next = jest.fn()
  })

  it('should set an empty context object on request and response objects', () => {
    expressContext()(req, res, next)

    expect(req.context).toEqual({})
    expect(res.context).toEqual({})
    expect(next).toHaveBeenCalledTimes(1)
  })
})
