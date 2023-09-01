/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './particularJobInterestsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import WorkInterestsValue from '../../../enums/workInterestsValue'

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

describe('ParticularJobInterestsController', () => {
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
    workInterests: [WorkInterestsValue.OTHER],
    workInterestsOther: 'Other job',
    particularJobInterests: {},
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
      setSessionData(req, ['particularJobInterests', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        workInterests: [WorkInterestsValue.OTHER],
        workInterestsOther: 'Other job',
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
        workInterests: [WorkInterestsValue.OTHER],
        workInterestsOther: 'Other job',
        particularJobInterests: [{ workInterest: WorkInterestsValue.OTHER, role: 'Some job' }],
      })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/particularJobInterests/index', {
        ...mockData,
        backLocation: addressLookup.createPlan.checkYourAnswers(id),
        workInterests: [WorkInterestsValue.OTHER],
        workInterestsOther: 'Other job',
        particularJobInterests: {
          OTHER: 'Some job',
        },
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
      setSessionData(req, ['particularJobInterests', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/particularJobInterests/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new - Sets session record then redirects to skills', async () => {
      req.body.OTHER = 'Some job'
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        particularJobInterests: [{ workInterest: WorkInterestsValue.OTHER, role: 'Some job' }],
      })
      expect(getSessionData(req, ['particularJobInterests', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.skills(id))
    })

    it('On success - mode = edit - Sets session record then redirects to checkYourAnswers', async () => {
      req.body.OTHER = 'Some job'
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        particularJobInterests: [{ workInterest: WorkInterestsValue.OTHER, role: 'Some job' }],
      })
      expect(getSessionData(req, ['particularJobInterests', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
    })

    it('On success - mode = update - calls api and redirects to redirect', async () => {
      req.context.plan = { workExperience: { workInterests: {} } }
      req.body.OTHER = 'Some job'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockService.updateCiagPlan).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.redirect(id))
    })
  })
})
