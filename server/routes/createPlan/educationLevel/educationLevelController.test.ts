/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './educationLevelController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import uuidv4 from '../../../utils/guid'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

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

jest.mock('../../../utils/urlParameterEncryption')

describe('EducationLevelController', () => {
  const { req, res, next } = expressMocks()
  const uuidv4Mock = uuidv4 as jest.Mock

  uuidv4Mock.mockReturnValue('guid')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  req.originalUrl = 'mock_url'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.qualifications(id),
    backLocationAriaText: "Back to Mock_firstname Mock_lastname's qualifications",
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
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
      setSessionData(req, ['educationLevel', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        educationLevel: EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY,
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/educationLevel/index', {
        ...mockData,
        educationLevel: EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY,
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
      mockService.updateCiagPlan.mockReset()
      setSessionData(req, ['educationLevel', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/educationLevel/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - educationLevel = NOT_SURE - Sets session record then redirects to additionalTraining', async () => {
      req.body.educationLevel = EducationLevelValue.NOT_SURE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.additionalTraining(id, mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.NOT_SURE,
        qualifications: [],
      })
    })

    it('On success - educationLevel = PRIMARY_SCHOOL - Sets session record then redirects to additionalTraining', async () => {
      req.body.educationLevel = EducationLevelValue.PRIMARY_SCHOOL

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.additionalTraining(id, mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.PRIMARY_SCHOOL,
        qualifications: [],
      })
    })

    it('On success - educationLevel = SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS - Sets session record then redirects to additionalTraining', async () => {
      req.body.educationLevel = EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.additionalTraining(id, mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS,
        qualifications: [],
      })
    })

    it('On success - educationLevel = SECONDARY_SCHOOL_TOOK_EXAMS - Sets session record then redirects to qualificationLevel', async () => {
      req.body.educationLevel = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualificationLevel(id, 'guid', mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications: [],
      })
    })

    it('On success - educationLevel = FURTHER_EDUCATION_COLLEGE - Sets session record then redirects to qualificationLevel', async () => {
      req.body.educationLevel = EducationLevelValue.FURTHER_EDUCATION_COLLEGE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualificationLevel(id, 'guid', mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [],
      })
    })

    it('On success - educationLevel = UNDERGRADUATE_DEGREE_AT_UNIVERSITY - Sets session record then redirects to qualificationDetails', async () => {
      req.body.educationLevel = EducationLevelValue.UNDERGRADUATE_DEGREE_AT_UNIVERSITY

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualificationDetails(id, 'guid', mode)}?from=${encryptUrlParameter(
          req.originalUrl,
        )}`,
      )
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.UNDERGRADUATE_DEGREE_AT_UNIVERSITY,
        qualifications: [{ id: 'guid', level: QualificationLevelValue.LEVEL_6 }],
      })
    })

    it('On success - educationLevel = POSTGRADUATE_DEGREE_AT_UNIVERSITY - Sets session record then redirects to qualificationDetails', async () => {
      req.body.educationLevel = EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualificationDetails(id, 'guid', mode)}?from=${encryptUrlParameter(
          req.originalUrl,
        )}`,
      )
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY,
        qualifications: [{ id: 'guid', level: QualificationLevelValue.LEVEL_8 }],
      })
    })

    it('On success - educationLevel = SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS - mode === edit - Sets session record then redirects to checkYourAnswers', async () => {
      req.body.educationLevel = EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS,
        qualifications: [],
      })
    })

    it('On success - mode = update - calls api and redirects to learning profile', async () => {
      req.context.plan = { qualificationsAndTraining: {} }
      req.body.educationLevel = EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockService.updateCiagPlan).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.learningPlan.profile(id))
    })

    it('On success - mode = update - higher level - calls api and redirects to qualificationLevel', async () => {
      req.context.plan = { qualificationsAndTraining: {} }
      req.body.educationLevel = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockService.updateCiagPlan).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualificationLevel(id, 'guid', 'update')}?from=${encryptUrlParameter(
          req.originalUrl,
        )}`,
      )
    })
  })
})
