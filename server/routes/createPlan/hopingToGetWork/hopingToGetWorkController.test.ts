import { plainToClass } from 'class-transformer'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './hopingToGetWorkController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./validationSchema', () => ({
  ...jest.requireActual('./validationSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('HopingToGetWorkController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    backLocation: addressLookup.workPlan(id),
    backLocationAriaText: 'Back to Mock_firstname Mock_lastname',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {})
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/hopingToGetWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }

    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      validationMock.mockReset()
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {})
    })

    it('On error - Calls next with error', async () => {
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with the correct data', async () => {
      validationMock.mockImplementation(() => errors)

      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/hopingToGetWork/index', { ...mockData, errors })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - hopingToGetWork = YES - Sets session record then redirects to supportOptIn', async () => {
      req.body.hopingToGetWork = HopingToGetWorkValue.YES

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualifications(id, 'new'))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.YES })
    })

    it('On success - hopingToGetWork = NO - Sets session record then redirects to ineligableToWork', async () => {
      req.body.hopingToGetWork = HopingToGetWorkValue.NO

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.reasonToNotGetWork(id))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.NO })
    })

    it('On success - hopingToGetWork = NOT_SURE - Sets session record then redirects to checkYourAnswers', async () => {
      req.body.hopingToGetWork = HopingToGetWorkValue.NOT_SURE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.reasonToNotGetWork(id))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.NOT_SURE })
    })
  })
})
