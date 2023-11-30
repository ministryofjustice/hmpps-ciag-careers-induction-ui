/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import config from '../config'
import plpFrontendRedirect, { AddressLookupKey } from './plpFrontendRedirect'
import addressLookup from '../routes/addressLookup'

jest.mock('../config')
jest.mock('../routes/addressLookup')

describe('plpFrontendRedirect', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock<NextFunction>

  beforeEach(() => {
    req = { params: { id: 'someId' } }
    res = { redirect: jest.fn() }
    next = jest.fn()
    ;(addressLookup.ciagList as jest.Mock).mockReturnValue('/ciagListPath')
    ;(addressLookup.workPlan as jest.Mock).mockReturnValue('/workPlanPath')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should redirect to ciagList if plpPagesEnabled is true', async () => {
    // Mock the featureToggles
    ;(config.featureToggles as any).plpPagesEnabled = true

    const middleware = plpFrontendRedirect(AddressLookupKey.ciagList)
    await middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/ciagListPath')
    expect(next).not.toHaveBeenCalled()
  })

  it('should redirect to workPlan if plpPagesEnabled is true', async () => {
    // Mock the featureToggles
    ;(config.featureToggles as any).plpPagesEnabled = true

    const middleware = plpFrontendRedirect(AddressLookupKey.workPlan)
    await middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/workPlanPath')
    expect(next).not.toHaveBeenCalled()
  })

  it('should not redirect if plpPagesEnabled is false', async () => {
    // Mock the featureToggles
    ;(config.featureToggles as any).plpPagesEnabled = false

    const middleware = plpFrontendRedirect(AddressLookupKey.ciagList)
    await middleware(req as Request, res as Response, next)

    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
