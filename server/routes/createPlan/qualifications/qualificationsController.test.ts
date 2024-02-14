/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './qualificationsController'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { getSessionData, setSessionData } from '../../../utils/session'
import uuidv4 from '../../../utils/guid'
import config from '../../../config'

jest.mock('../../../utils/guid', () => ({
  ...jest.requireActual('../../../utils/guid'),
  __esModule: true,
  default: jest.fn(),
}))

describe('QualificationsController', () => {
  const { req, res, next } = expressMocks()
  const uuidv4Mock = uuidv4 as jest.Mock

  uuidv4Mock.mockReturnValue('guid')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData: any = {
    backLocation: '/plan/create/mock_ref/hoping-to-get-work/new',
    backLocationAriaText: "Back to Is Mock_firstname Mock_lastname hoping to get work when they're released?",
    prisoner: {
      dateOfBirth: 'N/A',
      firstName: 'Mock_firstname',
      lastName: 'Mock_lastname',
      releaseDate: 'N/A',
      receptionDate: 'N/A',
    },
    qualifications: [],
  }

  res.locals.user = {}

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
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NO,
        qualifications: [],
      })
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - No Record - Redirects to hopingToGetWork', async () => {
      setSessionData(req, ['createPlan', id], undefined)

      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.hopingToGetWork(id))
      expect(res.render).toHaveBeenCalledTimes(0)
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - YES - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/qualifications/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      mockCiagService.updateCiagPlan.mockReset()
      mockInductionService.updateInduction.mockReset()
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        qualifications: [
          { id: 'A', level: 'LEVEL_3', subject: 'Maths', grade: 'A' },
          { id: 'B', level: 'LEVEL_3', subject: 'English', grade: 'C' },
        ],
      })
      req.body = {}
    })

    it('On error - Calls next with error', async () => {
      res.redirect.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On success - addQualification - Redirects to educationLevel', async () => {
      req.body.addQualification = 'addQualification'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualificationLevel(id, 'guid', mode))
    })

    it('On success - removeQualification - Redirects to educationLevel', async () => {
      req.body.removeQualification = 'LEVEL_3-Maths-A'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        qualifications: [{ id: 'B', level: 'LEVEL_3', subject: 'English', grade: 'C' }],
      })

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualifications(id, mode))
    })

    it('On success - Continue - No qualifications - Redirects to educationLevel', async () => {
      setSessionData(req, ['createPlan', id], {
        qualifications: [],
        educationLevel: 'mock_value',
      })
      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.educationLevel(id))
    })

    it('On success - Continue - qualifications - Redirects to educationLevel', async () => {
      setSessionData(req, ['createPlan', id], {
        qualifications: [{ id: 'A' }, { id: 'B' }],
        educationLevel: 'mock_value',
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.additionalTraining(id))
    })

    it('On success - Edit - Continue - educationLevel - Redirects to checkYourAnswers', async () => {
      req.params.mode = 'edit'

      setSessionData(req, ['createPlan', id], {
        qualifications: [{ id: 'A' }, { id: 'B' }],
        educationLevel: 'mock_value',
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
    })

    it('On success - mode = update - redirects to education and training', async () => {
      req.params.mode = 'update'
      req.context.plan = {
        qualificationsAndTraining: {
          qualifications: [{}],
        },
      }

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.learningPlan.profile(id, 'education-and-training'))
    })

    it('On success - mode = update - remove qualification - calls CIAG api and redirects to qualifications', async () => {
      config.featureToggles.useNewInductionApiEnabled = false
      req.body.removeQualification = 'LEVEL_3-Maths-A'
      req.params.mode = 'update'
      req.context.plan = {
        qualificationsAndTraining: {
          qualifications: [{}],
        },
      }

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualifications(id, 'update'))
    })

    it('On success - mode = update - remove qualification - calls Induction api and redirects to qualifications', async () => {
      config.featureToggles.useNewInductionApiEnabled = true
      req.body.removeQualification = 'LEVEL_3-Maths-A'
      req.params.mode = 'update'
      req.context.plan = {
        qualificationsAndTraining: {
          qualifications: [{}],
        },
      }

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockInductionService.updateInduction).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualifications(id, 'update'))
    })
  })
})
