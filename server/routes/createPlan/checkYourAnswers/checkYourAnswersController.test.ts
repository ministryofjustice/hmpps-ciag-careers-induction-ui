/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './checkYourAnswersController'
import { setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

describe('CheckYourAnswersController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    id: 'mock_ref',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    record: { hopingToGetWork: 'YES' },
    statusChange: false,
  }

  res.locals.user = {}

  const mockService: any = {
    createCiagPlan: jest.fn(),
    updateCiagPlan: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['createPlan', id], { hopingToGetWork: 'YES' })
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - No record - Redirects to hopingToGetWork', async () => {
      setSessionData(req, ['createPlan', id], undefined)

      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.hopingToGetWork(id))
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/checkYourAnswers/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      setSessionData(req, ['inPrisonWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {})
      mockService.createCiagPlan.mockReset()
      mockService.updateCiagPlan.mockReset()
    })

    it('On error - Calls next with error', async () => {
      mockService.createCiagPlan.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On success - UPDATE - Calls api update', async () => {
      req.context.plan = { hopingToGetWork: HopingToGetWorkValue.NOT_SURE, desireToWork: false }
      setSessionData(req, ['isUpdateFlow', id], true)
      mockService.updateCiagPlan.mockReturnValue({})
      controller.post(req, res, next)

      expect(mockService.updateCiagPlan).toBeCalledTimes(1)
    })

    it('On success - NEW - Calls api acreate', async () => {
      setSessionData(req, ['isUpdateFlow', id], undefined)
      mockService.updateCiagPlan.mockReturnValue({})
      controller.post(req, res, next)

      expect(mockService.createCiagPlan).toBeCalledTimes(1)
    })
  })
})
