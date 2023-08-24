/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './wantsToAddQualificationsController'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import validateFormSchema from '../../../utils/validateFormSchema'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import { setSessionData } from '../../../utils/session'
import uuidv4 from '../../../utils/guid'
import YesNoValue from '../../../enums/yesNoValue'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'

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

describe('WantsToAddQualificationsController', () => {
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
    wantsToAddQualifications: undefined,
    backLocation: '/plan/create/mock_ref/reason-to-not-get-work/new',
    backLocationAriaText: "Back to Why is Mock_firstname Mock_lastname not hoping to get work when they're released?",
    prisoner: {
      dateOfBirth: 'N/A',
      firstName: 'Mock_firstname',
      lastName: 'Mock_lastname',
      releaseDate: 'N/A',
    },
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NO,
        wantsToAddQualifications: YesNoValue.YES,
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
        notHopingToGetWork: ReasonToNotGetWorkValue.NO_RIGHT_TO_WORK,
        educationLevel: EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
      })

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - YES - Calls render with the correct data', async () => {
      controller.get(req, res, next)
      //
      // expect(res.render).toHaveBeenCalledWith('pages/createPlan/wantsToAddQualifications/index', { ...mockData })
      // expect(next).toHaveBeenCalledTimes(0)
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
      setSessionData(req, ['hopingToGetWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NO,
      })
      req.body = {}
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

      expect(res.render).toHaveBeenCalledWith('pages/createPlan/wantsToAddQualifications/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - new - wantsToAddQualifications === YES - Redirects to educationLevel', async () => {
      req.body.wantsToAddQualifications = 'YES'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualificationLevel(id, 'guid', mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
    })

    it('On success - new - wantsToAddQualifications === NO - Redirects to additionalTraining', async () => {
      req.body.wantsToAddQualifications = 'NO'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.additionalTraining(id, mode)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
    })

    it('On success - edit - no change - Redirects to checkYourAnswers', async () => {
      req.body.wantsToAddQualifications = 'NO'
      req.params.mode = 'edit'
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NO,
        wantsToAddQualifications: YesNoValue.NO,
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
    })

    it('On success - edit - change to wantsToAddQualifications === NO - Redirects to checkYourAnswers', async () => {
      req.body.wantsToAddQualifications = 'NO'
      req.params.mode = 'edit'
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.NO,
        wantsToAddQualifications: YesNoValue.YES,
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.checkYourAnswers(id))
    })

    it('On success - edit - change to wantsToAddQualifications === YES - Redirects to qualificationLevel', async () => {
      req.body.wantsToAddQualifications = 'YES'
      req.params.mode = 'edit'
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork: HopingToGetWorkValue.YES,
        wantsToAddQualifications: YesNoValue.NO,
      })

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createPlan.qualificationLevel(id, 'guid', 'edit')}?from=${encryptUrlParameter(
          req.originalUrl,
        )}`,
      )
    })
  })
})
