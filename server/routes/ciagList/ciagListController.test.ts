/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import expressMocks from '../../testutils/expressMocks'
import Controller from './ciagListController'
import CiagViewModel from '../../viewModels/ciagViewModel'
import validateFormSchema from '../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../utils/session'
import addressLookup from '../addressLookup'

jest.mock('../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))
describe('CiagListController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}

  req.context.ciagList = {
    content: [
      {
        prisonerNumber: 'A5555DY',
        firstName: 'mock_firstname1',
        lastName: 'mock_lastName1',
        releaseDate: '31 Aug 2017',
        nonDtoReleaseDateType: 'PRRD',
        receptionDate: '24 Feb 2020',
      },
      {
        prisonerNumber: 'A6666DY',
        firstName: 'mock_firstname2',
        lastName: 'mock_lastName2',
        releaseDate: '31 Aug 2017',
        nonDtoReleaseDateType: 'PRRD',
        receptionDate: '04 Nov 2020',
      },
    ],
    params: { sort: '', order: '', searchTerm: '', statusFilter: '' },
    query: {},
    get: jest.fn(),
  }

  const { sort = '', order = '', searchTerm = '', statusFilter = '' } = req.params

  req.query = { sort, order }
  req.get = jest.fn()

  const mockPaginationService: any = {
    paginationData: {},
    getPagination: jest.fn(),
  }

  const paginationData = {}
  const mockData = {
    prisonerSearchResults: {
      ...req.context.ciagList.content.reduce((acc: any, ciag: any, index: number) => {
        acc[index] = plainToClass(CiagViewModel, ciag)
        return acc
      }, {}),
    },
  }

  const controller = new Controller(mockPaginationService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      mockPaginationService.getPagination.mockReturnValue(paginationData)
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - records found - call renders with the correct data', async () => {
      await controller.get(req, res, next)
      next.mockReset()

      expect(res.render).toHaveBeenCalledWith('pages/ciagList/index', {
        ...mockData,
        sort,
        order,
        paginationData,
        searchTerm: decodeURIComponent(searchTerm as string),
        statusFilter: decodeURIComponent(statusFilter as string),
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
      setSessionData(req, ['ciagList', 'data'], mockData)
      mockPaginationService.getPagination.mockReturnValue(paginationData)
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('On error - Calls next with error', async () => {
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with correct data', async () => {
      validationMock.mockImplementation(() => errors)

      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/ciagList/index', {
        ...mockData,
        errors,
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.searchTerm = 'name1'
      req.body.statusFilter = 'NEEDS_PLAN'

      controller.post(req, res, next)

      expect(getSessionData(req, ['ciagList', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.prisonerSearch()}${'?searchTerm=name1&statusFilter=NEEDS_PLAN'}`,
      )
    })
  })
})
