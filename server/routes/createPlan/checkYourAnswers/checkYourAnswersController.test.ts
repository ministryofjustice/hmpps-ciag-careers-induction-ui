/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './checkYourAnswersController'
import { setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import config from '../../../config'

describe('CheckYourAnswersController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  const prisonNumber = 'A1234BC'
  req.params.id = prisonNumber
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    id: prisonNumber,
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    record: { hopingToGetWork: 'YES' },
    statusChange: false,
  }

  res.locals.user = {}

  const mockCiagService: any = {
    createCiagPlan: jest.fn(),
    updateCiagPlan: jest.fn(),
  }

  const mockInductionService: any = {
    createInduction: jest.fn(),
  }

  let learningPlanUrl: string
  beforeAll(() => {
    learningPlanUrl = config.learningPlanUrl
    config.learningPlanUrl = 'http://plp-ui-url'
  })

  afterAll(() => {
    config.learningPlanUrl = learningPlanUrl
  })

  const controller = new Controller(mockCiagService, mockInductionService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['createPlan', id], { hopingToGetWork: 'YES' })
    })

    it('On error - Calls next with error', async () => {
      // Given
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })

      // Given
      await controller.get(req, res, next)

      // Then
      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - No record - Redirects to hopingToGetWork', async () => {
      // Given
      setSessionData(req, ['createPlan', id], undefined)

      // When
      await controller.get(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createPlan.hopingToGetWork(id))
    })

    it('On success - Calls render with the correct data', async () => {
      // Given

      // When
      await controller.get(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createPlan/checkYourAnswers/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      setSessionData(req, ['inPrisonWork', id, 'data'], mockData)
      setSessionData(req, ['createPlan', id], {})
      mockCiagService.createCiagPlan.mockReset()
      mockCiagService.updateCiagPlan.mockReset()
    })

    it('On error - Calls next with error', async () => {
      // Given
      mockCiagService.createCiagPlan.mockImplementation(() => {
        throw new Error('mock_error')
      })

      // When
      await controller.post(req, res, next)

      // Then
      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On success - UPDATE - Calls CIAG API update', async () => {
      // Given
      config.featureToggles.useNewInductionApiEnabled = false
      req.context.plan = { hopingToGetWork: HopingToGetWorkValue.NOT_SURE, desireToWork: false }
      setSessionData(req, ['isUpdateFlow', id], true)
      mockCiagService.updateCiagPlan.mockReturnValue({})

      // When
      await controller.post(req, res, next)

      // Then
      expect(mockCiagService.updateCiagPlan).toHaveBeenCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith('http://plp-ui-url/plan/A1234BC/view/work-and-interests')
    })

    it('On success - NEW - Calls CIAG API create', async () => {
      // Given
      config.featureToggles.useNewInductionApiEnabled = false
      setSessionData(req, ['isUpdateFlow', id], undefined)
      mockCiagService.updateCiagPlan.mockReturnValue({})

      // When
      await controller.post(req, res, next)

      // Then
      expect(mockCiagService.createCiagPlan).toHaveBeenCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith('http://plp-ui-url/plan/A1234BC/induction-created')
    })

    it('On success - NEW - Calls PLP API create', async () => {
      // Given
      config.featureToggles.useNewInductionApiEnabled = true
      setSessionData(req, ['isUpdateFlow', id], undefined)

      // When
      await controller.post(req, res, next)

      // Then
      expect(mockInductionService.createInduction).toHaveBeenCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith('http://plp-ui-url/plan/A1234BC/induction-created')
    })
  })
})
