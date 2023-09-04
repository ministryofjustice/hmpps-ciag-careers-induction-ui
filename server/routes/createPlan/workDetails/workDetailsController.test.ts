/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './workDetailsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import uuidv4 from '../../../utils/guid'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

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

describe('WorkDetailsController', () => {
  const { req, res, next } = expressMocks()
  const uuidv4Mock = uuidv4 as jest.Mock

  uuidv4Mock.mockReturnValue('guid')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  req.params.typeOfWorkExperienceKey = 'OTHER'
  const { id, mode, typeOfWorkExperienceKey } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.typeOfWorkExperience(id, mode),
    backLocationAriaText: 'Back to What type of work has Mock_firstname Mock_lastname done before?',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    typeOfWorkExperienceKey: 'OTHER',
    jobDetails: 'mock_details',
    jobRole: 'mock_role',
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
      setSessionData(req, ['workDetails', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        typeOfWorkExperience: [typeOfWorkExperienceKey],
        workExperience: [
          {
            typeOfWorkExperience: typeOfWorkExperienceKey,
            details: 'mock_details',
            role: 'mock_role',
          },
        ],
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/workDetails/index', {
        ...mockData,
        jobRole: 'mock_role',
        jobDetails: 'mock_details',
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
      setSessionData(req, ['workDetails', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        typeOfWorkExperience: [typeOfWorkExperienceKey],
        workExperience: [],
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
      req.body.jobRole = 'current_mock_role'
      req.body.jobDetails = 'current_mock_details'

      validationMock.mockImplementation(() => errors)

      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/workDetails/index', {
        ...mockData,
        jobDetails: 'current_mock_details',
        jobRole: 'current_mock_role',
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Last typeOfWorkExperience - Sets session record then redirects to workInterests', async () => {
      req.body.jobRole = 'mock_role'
      req.body.jobDetails = 'mock_details'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.workInterests(id, mode))
      expect(getSessionData(req, ['workDetails', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        typeOfWorkExperience: [typeOfWorkExperienceKey],
        workExperience: [
          {
            typeOfWorkExperience: typeOfWorkExperienceKey,
            role: 'mock_role',
            details: 'mock_details',
          },
        ],
      })
    })

    it('On success - Not last typeOfWorkExperience - Sets session record then redirects to workDetails', async () => {
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        typeOfWorkExperience: [typeOfWorkExperienceKey, TypeOfWorkExperienceValue.RETAIL],
        workExperience: [],
      })

      req.body.jobRole = 'mock_role'
      req.body.jobDetails = 'mock_details'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        addressLookup.createPlan.workDetails(id, TypeOfWorkExperienceValue.RETAIL, mode),
      )
      expect(getSessionData(req, ['workDetails', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        typeOfWorkExperience: [typeOfWorkExperienceKey, TypeOfWorkExperienceValue.RETAIL],
        workExperience: [
          {
            typeOfWorkExperience: typeOfWorkExperienceKey,
            role: 'mock_role',
            details: 'mock_details',
          },
        ],
      })
    })

    it('On success - Not last typeOfWorkExperience - mode === edit - Sets session record then redirects to workDetails', async () => {
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        typeOfWorkExperience: [typeOfWorkExperienceKey, TypeOfWorkExperienceValue.RETAIL],
        workExperience: [],
      })

      req.body.jobRole = 'mock_role'
      req.body.jobDetails = 'mock_details'
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        addressLookup.createPlan.workDetails(id, TypeOfWorkExperienceValue.RETAIL, 'edit'),
      )
      expect(getSessionData(req, ['workDetails', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        typeOfWorkExperience: [typeOfWorkExperienceKey, TypeOfWorkExperienceValue.RETAIL],
        workExperience: [
          {
            typeOfWorkExperience: typeOfWorkExperienceKey,
            role: 'mock_role',
            details: 'mock_details',
          },
        ],
      })
    })

    it('On success - Last typeOfWorkExperience - mode === edit - Sets session record then redirects to checkYourAnswers', async () => {
      req.body.jobRole = 'mock_role'
      req.body.jobDetails = 'mock_details'
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
      expect(getSessionData(req, ['workDetails', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        typeOfWorkExperience: [typeOfWorkExperienceKey],
        workExperience: [
          {
            typeOfWorkExperience: typeOfWorkExperienceKey,
            role: 'mock_role',
            details: 'mock_details',
          },
        ],
      })
    })

    it('On success - mode = update - calls api and redirects to redirect', async () => {
      req.context.plan = {
        workExperience: {
          typeOfWorkExperience: [typeOfWorkExperienceKey],
          workExperience: [
            {
              typeOfWorkExperience: typeOfWorkExperienceKey,
              details: 'mock_details',
              role: 'mock_role',
            },
          ],
        },
      }
      req.body.jobRole = 'mock_role'
      req.body.jobDetails = 'mock_details'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockService.updateCiagPlan).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.learningPlan.profile(id))
    })
  })
})
