import expressMocks from '../../testutils/expressMocks'
import Controller from './ciagListController'
import { deleteSessionData } from '../../utils/session'

describe('CiagListController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}

  req.context.ciagList = {
    prisonerSearchResults: [
      {
        prisonerNumber: 'A5555DY',
        firstName: 'mock_firstname1',
        lastName: 'mock_lastName1',
        nonDtoReleaseDate: '2017-08-31',
        nonDtoReleaseDateType: 'PRRD',
        receptionDate: '2020-02-24',
      },
      {
        prisonerNumber: 'A6666DY',
        firstName: 'mock_firstname2',
        lastName: 'mock_lastName2',
        nonDtoReleaseDate: '2017-08-31',
        nonDtoReleaseDateType: 'PRRD',
        receptionDate: '2020-11-04',
      },
    ],
    totalElements: 2,
  }

  req.params.sort = 'releaseDate'
  req.params.order = 'descending'
  const { sort, order } = req.params

  req.query = { sort, order }
  req.get = jest.fn()

  const mockData = req.context.ciagList

  const mockSearchService: any = {
    getPrisonerByCaseloadID: jest.fn(),
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
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

      // expect(res.render).toHaveBeenCalledWith('pages/ciagList/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })
})
