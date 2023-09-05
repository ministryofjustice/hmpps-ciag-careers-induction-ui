import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import config from '../../config'
import PaginationService from '../../services/paginationServices'
import { filterCiagList, getPaginatedCiagList, sortOffenderProfile } from '../../data/prisonerSearch/utils'
import CiagViewModel from '../../viewModels/ciagViewModel'

const PRISONER_SEARCH_BY_CASELOAD_ID = '/'

export default class CiagListController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { ciagList } = req.context
    const { page = '0', sort = '', order = '', searchTerm = '' } = req.query
    const { paginationPageSize } = config

    try {
      // Handle pagination where necessary
      // 1. Build uri
      let paginationData = {}
      let paginatedCiagList = ciagList.content

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        searchTerm && `searchTerm=${decodeURIComponent(searchTerm as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // 2. Sort where necessary
      if (sort && ciagList) {
        paginatedCiagList = sortOffenderProfile(ciagList.content, sort.toString(), order.toString())
      }

      // 3. Filter where necessary
      if (searchTerm) {
        paginatedCiagList = filterCiagList(paginatedCiagList, searchTerm as string)
      }

      // 4. Build pagination
      const pagedResponse = getPaginatedCiagList(paginatedCiagList, parseInt(page.toString(), 10))
      if (pagedResponse.totalPages > 0 && parseInt(paginationPageSize.toString(), 10)) {
        paginationData = this.paginationService.getPagination(
          pagedResponse,
          new URL(`${req.protocol}://${req.get('host')}${PRISONER_SEARCH_BY_CASELOAD_ID}?${uri.join('&')}`),
        )
      }

      // 5. Format data before render
      const data = {
        prisonerSearchResults: {
          ...plainToClass(CiagViewModel, pagedResponse.content),
        },
        sort,
        order,
        paginationData,
        searchTerm: decodeURIComponent(searchTerm as string),
      }

      res.render('pages/ciagList/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { searchTerm } = req.body

    try {
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        searchTerm && `searchTerm=${encodeURIComponent(searchTerm)}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${PRISONER_SEARCH_BY_CASELOAD_ID}?${uri.join('&')}` : PRISONER_SEARCH_BY_CASELOAD_ID)
    } catch (err) {
      next(err)
    }
  }
}
