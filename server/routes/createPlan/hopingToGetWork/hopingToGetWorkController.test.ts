/* eslint-disable @typescript-eslint/no-explicit-any */

import { plainToClass } from 'class-transformer'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './hopingToGetWorkController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'
import YesNoValue from '../../../enums/yesNoValue'
import config from '../../../config'

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

jest.mock('../../../utils/urlParameterEncryption')

describe('HopingToGetWorkController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  res.locals.user = {}
  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    backLocation: addressLookup.learningPlan.profile(id, 'overview'),
    backLocationAriaText: "Back to Mock_firstname Mock_lastname's learning and work progress",
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
  }

  const mockCiagService: any = {
    updateCiagPlan: jest.fn(),
  }

  const mockInductionService: any = {
    updateInduction: jest.fn(),
  }

  const controller = new Controller(mockCiagService, mockInductionService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {})
      req.params.mode = 'new'
      req.context.plan = undefined
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - NEW - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/hopingToGetWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - EDIT - Calls render with the correct data', async () => {
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/hopingToGetWork/index', {
        ...mockData,
        backLocation: '/plan/create/mock_ref/check-your-answers',
        backLocationAriaText: "Back to Check your answers before saving them to Mock_firstname Mock_lastname's plan",
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - UPDATE - Calls render with the correct data', async () => {
      req.context.plan = { hopingToGetWork: HopingToGetWorkValue.YES }
      req.params.mode = 'update'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/hopingToGetWork/index', {
        ...mockData,
        backLocation: 'http://localhost:3003/plan/mock_ref/view/work-and-interests',
        backLocationAriaText: "Back to Mock_firstname Mock_lastname's learning and work progress",
        hopingToGetWork: 'YES',
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
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {})
      req.params.mode = 'new'
      req.context.plan = undefined
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

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.reasonToNotGetWork(id, 'new'))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.NO })
    })

    it('On success - hopingToGetWork = NOT_SURE - Sets session record then redirects to checkYourAnswers', async () => {
      req.body.hopingToGetWork = HopingToGetWorkValue.NOT_SURE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.reasonToNotGetWork(id, 'new'))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.NOT_SURE })
    })

    it('On success - EDIT - hopingToGetWork no logic change - Sets session record then redirects to checkYourAnswers', async () => {
      req.params.mode = 'edit'
      req.body.hopingToGetWork = HopingToGetWorkValue.NOT_SURE
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NO,
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.NOT_SURE })
    })

    it('On success - EDIT - hopingToGetWork change to POSITIVE - Sets session record then redirects to checkYourAnswers', async () => {
      req.params.mode = 'edit'
      req.body.hopingToGetWork = HopingToGetWorkValue.YES
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NOT_SURE,
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualifications(id, 'new'))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.YES })
    })

    it('On success - EDIT - hopingToGetWork change to NEGATIVE - Sets session record then redirects to checkYourAnswers', async () => {
      req.params.mode = 'edit'
      req.body.hopingToGetWork = HopingToGetWorkValue.NO
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.reasonToNotGetWork(id, 'new'))
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({ hopingToGetWork: HopingToGetWorkValue.NO })
    })

    it('On success - UPDATE - hopingToGetWork no logic change - Calls CIAG API', async () => {
      config.featureToggles.useNewInductionApiEnabled = false
      req.params.mode = 'update'
      req.body.hopingToGetWork = HopingToGetWorkValue.NOT_SURE
      req.context.plan = { hopingToGetWork: HopingToGetWorkValue.NO, desireToWork: false }

      controller.post(req, res, next)

      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(mockCiagService.updateCiagPlan).toBeCalledTimes(1)
    })

    it('On success - UPDATE - hopingToGetWork no logic change - Calls Induction API', async () => {
      config.featureToggles.useNewInductionApiEnabled = true
      req.params.mode = 'update'
      req.body.hopingToGetWork = HopingToGetWorkValue.NOT_SURE
      req.context.plan = { hopingToGetWork: HopingToGetWorkValue.NO, desireToWork: false }

      controller.post(req, res, next)

      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(mockInductionService.updateInduction).toBeCalledTimes(1)
    })

    it('On success - UPDATE - hopingToGetWork change to POSITIVE - Sets session record then redirects to qualifications', async () => {
      config.featureToggles.useNewInductionApiEnabled = true
      req.params.mode = 'update'
      req.body.hopingToGetWork = HopingToGetWorkValue.YES
      req.context.plan = { hopingToGetWork: HopingToGetWorkValue.NOT_SURE, desireToWork: false }

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualifications(id, 'new')}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: HopingToGetWorkValue.YES,
        wantsToAddQualifications: YesNoValue.NO,
        qualifications: [],
      })
      expect(mockInductionService.updateInduction).toBeCalledTimes(1)
    })

    it('On success - UPDATE - hopingToGetWork change to NEGATIVE - Sets session record then redirects to reasonToNotGetWork', async () => {
      config.featureToggles.useNewInductionApiEnabled = true
      req.params.mode = 'update'
      req.body.hopingToGetWork = HopingToGetWorkValue.NO
      req.context.plan = { hopingToGetWork: HopingToGetWorkValue.YES, desireToWork: true }

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.reasonToNotGetWork(id, 'new')}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['hopingToGetWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: HopingToGetWorkValue.NO,
        wantsToAddQualifications: YesNoValue.NO,
        qualifications: [],
      })
      expect(mockInductionService.updateInduction).toBeCalledTimes(1)
    })
  })
})
