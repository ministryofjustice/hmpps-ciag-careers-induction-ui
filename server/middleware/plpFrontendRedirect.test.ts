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

  it('should redirect to ciagList if plpHomePageEnabled is true', async () => {
    // Mock the featureToggles
    ;(config.featureToggles as any).plpHomePageEnabled = true

    const middleware = plpFrontendRedirect(AddressLookupKey.ciagList)
    await middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/ciagListPath')
    expect(next).not.toHaveBeenCalled()
  })

  it('should redirect to workPlan if plpHomePageEnabled is true', async () => {
    // Mock the featureToggles
    ;(config.featureToggles as any).plpHomePageEnabled = true

    const middleware = plpFrontendRedirect(AddressLookupKey.workPlan)
    await middleware(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/workPlanPath')
    expect(next).not.toHaveBeenCalled()
  })

  it('should not redirect if plpHomePageEnabled is false', async () => {
    // Mock the featureToggles
    ;(config.featureToggles as any).plpHomePageEnabled = false

    const middleware = plpFrontendRedirect(AddressLookupKey.ciagList)
    await middleware(req as Request, res as Response, next)

    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
