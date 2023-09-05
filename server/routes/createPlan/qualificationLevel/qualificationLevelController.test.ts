/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './qualificationLevelController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
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

describe('QualificationLevelController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  req.params.qualificationId = '1'
  const { id, mode, qualificationId } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.qualifications(id),
    backLocationAriaText: "Back to Mock_firstname Mock_lastname's qualifications",
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['qualificationLevel', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [
          {
            id: '1',
            level: QualificationLevelValue.ENTRY_LEVEL,
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/qualificationLevel/index', {
        ...mockData,
        qualificationLevel: QualificationLevelValue.ENTRY_LEVEL,
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
      setSessionData(req, ['qualificationLevel', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        qualifications: [
          {
            id: '1',
            level: QualificationLevelValue.ENTRY_LEVEL,
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/qualificationLevel/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Sets session record then redirects to qualificationDetails', async () => {
      req.body.qualificationLevel = QualificationLevelValue.LEVEL_1

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        addressLookup.createPlan.qualificationDetails(id, qualificationId, mode),
      )
      expect(getSessionData(req, ['qualificationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: 'FURTHER_EDUCATION_COLLEGE',
        hopingToGetWork: 'YES',
        qualifications: [
          {
            id: '1',
            level: 'LEVEL_1',
          },
        ],
      })
    })

    it('On success - Sets session record then redirects to qualificationDetails', async () => {
      req.body.qualificationLevel = QualificationLevelValue.LEVEL_1
      req.params.mode = 'update'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        addressLookup.createPlan.qualificationDetails(id, qualificationId, 'update'),
      )
      expect(getSessionData(req, ['qualificationLevel', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        educationLevel: 'FURTHER_EDUCATION_COLLEGE',
        hopingToGetWork: 'YES',
        qualifications: [
          {
            id: '1',
            level: 'LEVEL_1',
          },
        ],
      })
    })
  })
})
