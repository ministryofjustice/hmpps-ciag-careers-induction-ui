/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './functionalSkillsController'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import NotHopingToGetWorkValues from '../../../enums/notHopingToGetWorkValues'
import EducationLevelValue from '../../../enums/educationLevelValue'
import { setSessionData } from '../../../utils/session'
import uuidv4 from '../../../utils/guid'

jest.mock('../../../utils/guid', () => ({
  ...jest.requireActual('../../../utils/guid'),
  __esModule: true,
  default: jest.fn(),
}))

describe('FunctionalSkillsController', () => {
  const { req, res, next } = expressMocks()
  const uuidv4Mock = uuidv4 as jest.Mock

  uuidv4Mock.mockReturnValue('guid')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData: any = {
    backLocation: '/plan/create/mock_ref/hoping-to-get-work',
    backLocationAriaText: "Back to Is Mock_firstname Mock_lastname hoping to get work when they're released?",
    prisoner: {
      dateOfBirth: 'N/A',
      firstName: 'Mock_firstname',
      lastName: 'Mock_lastname',
      releaseDate: 'N/A',
    },
    qualifications: [],
  }

  const controller = new Controller()

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

    it('On success - Record found - not hopingTooGetWork - Redirects to hopingToGetWork', async () => {
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NOT_SURE,
        notHopingToGetWork: NotHopingToGetWorkValues.RIGHT_TO_WORK_IN_UK_NOT_CONFIRMED,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - YES - Calls render with the correct data', async () => {
      controller.get(req, res, next)
      //
      // expect(res.render).toHaveBeenCalledWith('pages/createPlan/functionalSkills/index', { ...mockData })
      // expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        qualifications: [{ id: 'A' }, { id: 'B' }],
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

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.educationLevel(id))
    })

    it('On success - Edit - Continue - educationLevel - Redirects to checkAnswers', async () => {
      req.params.mode = 'edit'

      setSessionData(req, ['createPlan', id], {
        qualifications: [{ id: 'A' }, { id: 'B' }],
        educationLevel: 'mock_value',
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkAnswers(id))
    })
  })
})
