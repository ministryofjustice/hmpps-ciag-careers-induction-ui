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

describe('EducationLevelController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.qualifications(id),
    backLocationAriaText: "Back to Mock_firstname Mock_lastname's qualifications",
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['educationLevel', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        educationLevel: EducationLevelValue.POSTGRADUATE_DEGREE,
      })
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - No record found - Calls render with the correct data', async () => {
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
        educationLevel: EducationLevelValue.POSTGRADUATE_DEGREE,
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

    it('On success - educationLevel = NOT_SURE - Sets session record then redirects to otherQualifications', async () => {
      req.body.educationLevel = EducationLevelValue.NOT_SURE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.otherQualifications(id, mode))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.NOT_SURE,
        qualifications: [],
      })
    })

    it('On success - educationLevel = PRIMARY_SCHOOL - Sets session record then redirects to otherQualifications', async () => {
      req.body.educationLevel = EducationLevelValue.PRIMARY_SCHOOL

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.otherQualifications(id, mode))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.PRIMARY_SCHOOL,
        qualifications: [],
      })
    })

    it('On success - educationLevel = SECONDARY_SCHOOL_NO_EXAMS - Sets session record then redirects to otherQualifications', async () => {
      req.body.educationLevel = EducationLevelValue.SECONDARY_SCHOOL_NO_EXAMS

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.otherQualifications(id, mode))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_NO_EXAMS,
        qualifications: [],
      })
    })

    it('On success - educationLevel = SECONDARY_SCHOOL_EXAMS - Sets session record then redirects to qualificationLevel', async () => {
      req.body.educationLevel = EducationLevelValue.SECONDARY_SCHOOL_EXAMS

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualificationLevel(id, '1', mode))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_EXAMS,
        qualifications: [],
      })
    })

    it('On success - educationLevel = FURTHER_EDUCATION_COLLEGE - Sets session record then redirects to qualificationLevel', async () => {
      req.body.educationLevel = EducationLevelValue.FURTHER_EDUCATION_COLLEGE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualificationLevel(id, '1', mode))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [],
      })
    })

    it('On success - educationLevel = UNDERGRADUATE_DEGREE - Sets session record then redirects to qualificationDetails', async () => {
      req.body.educationLevel = EducationLevelValue.UNDERGRADUATE_DEGREE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualificationDetails(id, '1', mode))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.UNDERGRADUATE_DEGREE,
        qualifications: [{ level: EducationLevelValue.UNDERGRADUATE_DEGREE }],
      })
    })

    it('On success - educationLevel = POSTGRADUATE_DEGREE - Sets session record then redirects to qualificationDetails', async () => {
      req.body.educationLevel = EducationLevelValue.POSTGRADUATE_DEGREE

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualificationDetails(id, '1', mode))
      expect(getSessionData(req, ['educationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: EducationLevelValue.POSTGRADUATE_DEGREE,
        qualifications: [{ level: EducationLevelValue.POSTGRADUATE_DEGREE }],
      })
    })
  })
})
