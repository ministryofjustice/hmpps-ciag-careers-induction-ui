/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './qualificationDetailsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
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

describe('QualificationDetailsController', () => {
  const { req, res, next } = expressMocks()
  const uuidv4Mock = uuidv4 as jest.Mock

  uuidv4Mock.mockReturnValue('guid')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  req.params.qualificationId = 'guid'
  const { id, mode, qualificationId } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.qualificationLevel(id, qualificationId),
    backLocationAriaText: 'Back to What level of qualification does Mock_firstname Mock_lastname want to add',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
    qualificationLevel: QualificationLevelValue.LEVEL_3,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['qualificationDetails', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [
          {
            id: qualificationId,
            level: QualificationLevelValue.LEVEL_3,
            grade: 'A',
            subject: 'Mathematics',
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/qualificationDetails/index', {
        ...mockData,
        qualificationSubject: 'Mathematics',
        qualificationGrade: 'A',
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
      setSessionData(req, ['qualificationDetails', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [
          {
            id: qualificationId,
            level: QualificationLevelValue.LEVEL_3,
          },
        ],
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/qualificationDetails/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Sets session record then redirects to qualificationDetails', async () => {
      req.body.qualificationSubject = 'Mathematics'
      req.body.qualificationGrade = 'A'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualifications(id, mode))
      expect(getSessionData(req, ['qualificationDetails', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: 'FURTHER_EDUCATION_COLLEGE',
        hopingToGetWork: 'YES',
        qualifications: [
          {
            id: qualificationId,
            level: 'LEVEL_3',
            subject: 'Mathematics',
            grade: 'A',
          },
        ],
      })
    })
  })
})
