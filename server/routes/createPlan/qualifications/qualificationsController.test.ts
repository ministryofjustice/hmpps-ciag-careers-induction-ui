/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './qualificationsController'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { getSessionData, setSessionData } from '../../../utils/session'

describe('QualificationsController', () => {
  const { req, res, next } = expressMocks()

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

    it('On success - No Record - Redirects to hopingToGetWork', async () => {
      setSessionData(req, ['createPlan', id], undefined)

      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.hopingToGetWork(id))
      expect(res.render).toHaveBeenCalledTimes(0)
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - NO - Redirects to hopingToGetWork', async () => {
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NO,
      })

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
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        qualifications: [{ id: 1 }, { id: 2 }],
      })
      req.body.removeQualification = undefined
      req.body.addQualification = undefined
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

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualificationLevel(id, mode))
    })

    it('On success - removeQualification - Redirects to educationLevel', async () => {
      req.body.removeQualification = '1'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createPlan', id])).toEqual({
        qualifications: [
          {
            id: 2,
          },
        ],
      })

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.qualifications(id, mode))
    })

    it('On success - Continue - No educationLevel - Redirects to educationLevel', async () => {
      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.educationLevel(id))
    })

    it('On success - Continue - educationLevel - Redirects to educationLevel', async () => {
      setSessionData(req, ['createPlan', id], {
        qualifications: [{ id: 1 }, { id: 2 }],
        educationLevel: 'mock_value',
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.otherQualifications(id))
    })

    it('On success - Edit - Continue - educationLevel - Redirects to checkAnswers', async () => {
      req.params.mode = 'edit'

      setSessionData(req, ['createPlan', id], {
        qualifications: [{ id: 1 }, { id: 2 }],
        educationLevel: 'mock_value',
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkAnswers(id))
    })
  })
})
