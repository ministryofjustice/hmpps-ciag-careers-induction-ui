import { plainToClass } from 'class-transformer'
import expressMocks from '../../testutils/expressMocks'
import Controller from './ciagListController'
import CiagViewModel from '../../viewModels/ciagViewModel'

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
    params: { sort: '', order: '', searchTerm: '' },
    query: {},
    get: jest.fn(),
  }

  const { sort = '', order = '', searchTerm = '' } = req.params

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
      })

      expect(next).toHaveBeenCalledTimes(0)
    })
  })
})
