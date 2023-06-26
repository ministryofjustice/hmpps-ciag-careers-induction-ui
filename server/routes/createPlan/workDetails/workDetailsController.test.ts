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
import TypeOfWorkValue from '../../../enums/typeOfWorkValue'

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
  req.params.typeOfWorkKey = 'OTHER'
  const { id, mode, typeOfWorkKey } = req.params

  const mockData = {
    backLocation: addressLookup.createPlan.typeOfWork(id, mode),
    backLocationAriaText: 'Back to What type of work has Mock_firstname Mock_lastname done before?',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    typeOfWorkKey: 'OTHER',
    jobDetails: 'mock_details',
    jobRole: 'mock_role',
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['workDetails', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        typeOfWork: [typeOfWorkKey],
        workExperience: [
          {
            typeOfWork: typeOfWorkKey,
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
        typeOfWork: [typeOfWorkKey],
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

    it('On success - Last typeOfWork - Sets session record then redirects to inPrisonWork', async () => {
      req.body.jobRole = 'mock_role'
      req.body.jobDetails = 'mock_details'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.inPrisonWork(id, mode))
      expect(getSessionData(req, ['workDetails', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        typeOfWork: [typeOfWorkKey],
        workExperience: [
          {
            typeOfWork: typeOfWorkKey,
            role: 'mock_role',
            details: 'mock_details',
          },
        ],
      })
    })

    it('On success - Not last typeOfWork - Sets session record then redirects to workDetails', async () => {
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        typeOfWork: [typeOfWorkKey, TypeOfWorkValue.CONSTRUCTION],
        workExperience: [],
      })

      req.body.jobRole = 'mock_role'
      req.body.jobDetails = 'mock_details'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        addressLookup.createPlan.workDetails(id, TypeOfWorkValue.CONSTRUCTION, mode),
      )
      expect(getSessionData(req, ['workDetails', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createPlan', id])).toEqual({
        hopingToGetWork: 'YES',
        typeOfWork: [typeOfWorkKey, TypeOfWorkValue.CONSTRUCTION],
        workExperience: [
          {
            typeOfWork: typeOfWorkKey,
            role: 'mock_role',
            details: 'mock_details',
          },
        ],
      })
    })
  })
})
