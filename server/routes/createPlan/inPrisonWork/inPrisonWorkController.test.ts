/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './inPrisonWorkController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

jest.mock('../../../utils/pageTitleLookup', () => ({
  ...jest.requireActual('../../../utils/pageTitleLookup'),
  __esModule: true,
  default: jest.fn(),
}))

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

describe('InPrisonWorkController', () => {
  const { req, res, next } = expressMocks()

  const pageTitleLookupMock = pageTitleLookup as jest.Mock
  pageTitleLookupMock.mockReturnValue('mock_page_title')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.hasWorkedBefore(id, mode),
    backLocationAriaText: 'Back to mock_page_title',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    inPrisonWork: [] as any,
  }

  res.locals.user = {}

  const mockService: any = {
    updateCiagPlan: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['inPrisonWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
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
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        inPrisonWork: InPrisonWorkValue.OTHER,
      })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/inPrisonWork/index', {
        ...mockData,
        backLocation: addressLookup.createPlan.checkYourAnswers(id),
        inPrisonWork: InPrisonWorkValue.OTHER,
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
      setSessionData(req, ['inPrisonWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
      })
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/inPrisonWork/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new - Sets session record then redirects to inPrisonEducation', async () => {
      req.body.inPrisonWork = [InPrisonWorkValue.OTHER]
      req.body.inPrisonWorkOther = 'mock_details'
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        inPrisonWork: [InPrisonWorkValue.OTHER],
        inPrisonWorkOther: 'mock_details',
      })
      expect(getSessionData(req, ['inPrisonWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.inPrisonEducation(id, mode))
    })

    it('On success - mode = edit - Sets session record then redirects to checkYourAnswers', async () => {
      req.body.inPrisonWork = [InPrisonWorkValue.OTHER]
      req.body.inPrisonWorkOther = 'mock_details'
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        inPrisonWork: [InPrisonWorkValue.OTHER],
        inPrisonWorkOther: 'mock_details',
      })
      expect(getSessionData(req, ['inPrisonWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
    })
  })
})
