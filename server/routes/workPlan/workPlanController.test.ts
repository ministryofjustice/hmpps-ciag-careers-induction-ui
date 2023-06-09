/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../testutils/expressMocks'
import Controller from './workPlanController'
import PrisonerViewModel from '../../viewModels/prisonerViewModel'

describe('WorkPlanController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.tab = 'overview'
  const { tab } = req.params

  const mockData = {
    id: 'mock_ref',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    tab,
  }

  res.locals.user = {}

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workPlan/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })
})
