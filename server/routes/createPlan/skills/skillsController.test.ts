/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './skillsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import SkillsValue from '../../../enums/skillsValue'
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

describe('SkillsController', () => {
  const { req, res, next } = expressMocks()

  const pageTitleLookupMock = pageTitleLookup as jest.Mock

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.qualifications(id, mode),
    backLocationAriaText: 'Back to mock_page_title',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    skills: [] as any,
  }

  res.locals.user = {}

  const mockInductionService: any = {
    updateInduction: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    pageTitleLookupMock.mockReturnValue('mock_page_title')
  })

  const controller = new Controller(mockInductionService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      setSessionData(req, ['skills', id, 'data'], mockData)
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
        skills: SkillsValue.OTHER,
      })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/skills/index', {
        ...mockData,
        backLocation: addressLookup.createPlan.checkYourAnswers(id),
        skills: SkillsValue.OTHER,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }

    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      setSessionData(req, ['skills', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/skills/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new - Sets session record then redirects to personalInterests', async () => {
      req.body.skills = SkillsValue.OTHER
      req.body.skillsOther = 'mock_details'
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        skills: SkillsValue.OTHER,
        skillsOther: 'mock_details',
      })
      expect(getSessionData(req, ['skills', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.personalInterests(id))
    })

    it('On success - mode = update - calls Induction api and redirects to learning profile', async () => {
      req.context.plan = {
        skillsAndInterests: {
          skills: [],
        },
      }
      req.body.skills = [SkillsValue.OTHER]
      req.body.skillsOther = 'mock_details'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockInductionService.updateInduction).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.learningPlan.profile(id))
    })
  })
})
