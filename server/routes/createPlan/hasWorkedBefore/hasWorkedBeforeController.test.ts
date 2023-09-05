/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './hasWorkedBeforeController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import YesNoValue from '../../../enums/yesNoValue'
import uuidv4 from '../../../utils/guid'

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

jest.mock('../../../utils/guid', () => ({
  ...jest.requireActual('../../../utils/guid'),
  __esModule: true,
  default: jest.fn(),
}))

describe('HasWorkedBeforeController', () => {
  const { req, res, next } = expressMocks()
  const uuidv4Mock = uuidv4 as jest.Mock

  uuidv4Mock.mockReturnValue('guid')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.additionalTraining(id, mode),
    backLocationAriaText:
      'Back to Does Mock_firstname Mock_lastname have any other training or vocational qualifications?',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
  }

  const mockService: any = {
    updateCiagPlan: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['hasWorkedBefore', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        hasWorkedBefore: YesNoValue.YES,
      })
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - No record found - Redirects to hopingToGetWork', async () => {
      setSessionData(req, ['createPlan', id], undefined)

      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.hopingToGetWork(id))
      expect(res.render).toHaveBeenCalledTimes(0)
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      req.params.mode = 'new'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/hasWorkedBefore/index', {
        ...mockData,
        hasWorkedBefore: YesNoValue.YES,
      })
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
      setSessionData(req, ['hasWorkedBefore', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/hasWorkedBefore/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - hasWorkedBefore = YES - Sets session record then redirects to typeOfWorkExperience', async () => {
      req.body.hasWorkedBefore = YesNoValue.YES

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.typeOfWorkExperience(id, mode))
      expect(getSessionData(req, ['hasWorkedBefore', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hasWorkedBefore: YesNoValue.YES,
      })
    })

    it('On success - hasWorkedBefore = NO - Sets session record then redirects to workInterests', async () => {
      req.body.hasWorkedBefore = YesNoValue.NO

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.workInterests(id, mode))
      expect(getSessionData(req, ['hasWorkedBefore', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hasWorkedBefore: YesNoValue.NO,
      })
    })
  })
})
