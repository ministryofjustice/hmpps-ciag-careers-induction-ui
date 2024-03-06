/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './reasonToNotGetWorkController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'

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

describe('ReasonToNotGetWorkController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'Mock_firstname',
    lastName: 'Mock_lastname',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.hopingToGetWork(id),
    backLocationAriaText: `Back to Is ${req.context.prisoner.firstName} ${req.context.prisoner.lastName} hoping to get work when they're released?`,
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    reasonToNotGetWork: [] as any,
  }

  res.locals.user = {}

  const mockInductionService: any = {
    updateInduction: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const controller = new Controller(mockInductionService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      setSessionData(req, ['reasonToNotGetWork', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/reasonToNotGetWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }

    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      setSessionData(req, ['reasonToNotGetWork', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/reasonToNotGetWork/index', { ...mockData, errors })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new - Sets session record then redirects to wantsToAddQualifications', async () => {
      req.body.reasonToNotGetWork = ReasonToNotGetWorkValue.OTHER
      req.body.reasonToNotGetWorkOther = 'mock_details'
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        reasonToNotGetWork: ReasonToNotGetWorkValue.OTHER,
        reasonToNotGetWorkOther: 'mock_details',
      })
      expect(getSessionData(req, ['personalInterests', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.wantsToAddQualifications(id))
    })

    it('On success - mode = edit - Sets session record then redirects to checkYourAnswers', async () => {
      req.body.reasonToNotGetWork = ReasonToNotGetWorkValue.OTHER
      req.body.reasonToNotGetWorkOther = 'mock_details'
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        reasonToNotGetWork: ReasonToNotGetWorkValue.OTHER,
        reasonToNotGetWorkOther: 'mock_details',
      })
      expect(getSessionData(req, ['personalInterests', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
    })

    it('On success - mode = update - calls Induction api and redirects to learning profile', async () => {
      req.context.plan = {}
      req.body.reasonToNotGetWork = ReasonToNotGetWorkValue.OTHER
      req.body.reasonToNotGetWorkOther = 'mock_details'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockInductionService.updateInduction).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.learningPlan.profile(id))
    })
  })
})
