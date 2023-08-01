/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './checkYourAnswersController'
import { setSessionData, getSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

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

  const controller = new Controller()

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

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/checkYourAnswers/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })
})
