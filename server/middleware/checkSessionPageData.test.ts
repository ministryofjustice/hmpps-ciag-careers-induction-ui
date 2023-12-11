/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express'
import checkSessionPageData from './checkSessionPageData'
import * as utils from '../utils'

jest.mock('../utils')

describe('checkSessionPageData', () => {
  const sessionPageKey = 'someKey'
  const req = { params: { id: 'someId' }, originalUrl: '/some-url' } as any

  it('should redirect if session data is not available', async () => {
    const res = {
      redirect: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction

    ;(utils.getSessionData as jest.Mock).mockReturnValueOnce(null)

    await checkSessionPageData(sessionPageKey)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(req.originalUrl)
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next if session data is available', async () => {
    const res = {
      redirect: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction

    ;(utils.getSessionData as jest.Mock).mockReturnValueOnce({
      /* some data */
    })

    await checkSessionPageData(sessionPageKey)(req, res, next)

    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
