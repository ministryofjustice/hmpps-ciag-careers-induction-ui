import { ParsedQs } from 'qs'
import { BuildSortUrlParams, buildSortUrl, SortOrder } from './columnSort'

describe('buildSortUrl', () => {
  const defaultSort = 'createdAt'
  const defaultOrder = SortOrder.ascending

  const mockParams: BuildSortUrlParams = {
    query: {},
    sortField: 'updatedAt',
    currentUrl: '/users?page=2&sort=createdAt&order=desc',
    defaultSort,
    defaultOrder,
  }

  it('should return the correct URL when called with no query parameters', () => {
    const expectedUrl = '/users?sort=updatedAt&order=ascending'
    const actualUrl = buildSortUrl(mockParams)

    expect(actualUrl).toBe(expectedUrl)
  })

  it('should return the correct URL when called with existing query parameters', () => {
    const query: ParsedQs = { page: '2', sort: 'createdAt', order: 'desc' }
    const expectedUrl = '/users?page=2&sort=updatedAt&order=ascending'
    const actualUrl = buildSortUrl({ ...mockParams, query })

    expect(actualUrl).toBe(expectedUrl)
  })

  it('should return the correct URL when called with sortField already in query', () => {
    const query: ParsedQs = { page: '2', sort: 'updatedAt', order: 'desc' }
    const expectedUrl = '/users?page=2&sort=updatedAt&order=ascending'
    const actualUrl = buildSortUrl({ ...mockParams, query })

    expect(actualUrl).toBe(expectedUrl)
  })

  it('should return the correct URL when called with sortField already in query and order is none', () => {
    const query: ParsedQs = { page: '2', sort: 'updatedAt', order: 'none' }
    const expectedUrl = '/users?page=2&sort=updatedAt&order=ascending'
    const actualUrl = buildSortUrl({ ...mockParams, query })

    expect(actualUrl).toBe(expectedUrl)
  })

  it('should return the correct URL when called with sortField already in query and order is ascending', () => {
    const query: ParsedQs = { page: '2', sort: 'updatedAt', order: 'ascending' }
    const expectedUrl = '/users?page=2&sort=updatedAt&order=descending'
    const actualUrl = buildSortUrl({ ...mockParams, query })

    expect(actualUrl).toBe(expectedUrl)
  })

  it('should return the correct URL when called with sortField already in query and order is descending', () => {
    const query: ParsedQs = { page: '2', sort: 'updatedAt', order: 'descending' }
    const expectedUrl = '/users?page=2&sort=updatedAt&order=ascending'
    const actualUrl = buildSortUrl({ ...mockParams, query })

    expect(actualUrl).toBe(expectedUrl)
  })

  it('should return the correct URL when called with sortField equal to defaultSort', () => {
    const query = { page: '2', sort: 'name', order: SortOrder.descending }
    const sortField = 'name'
    const currentUrl = '/users?page=2'
    const defaultSort = 'name'
    const defaultOrder = SortOrder.ascending

    const result = buildSortUrl({ query, sortField, currentUrl, defaultSort, defaultOrder })

    expect(result).toBe('/users?page=2&sort=name&order=ascending')
  })
})
