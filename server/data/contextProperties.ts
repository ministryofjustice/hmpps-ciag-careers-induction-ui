/**
 * Wrapper functions to set commonly used fields on an 'context' object that is managed over the scope of a request.
 * Hopefully reduces the liklihood of mis-typing property names.
 * Note that by convention the controller(s) and Middleware use the res.locals property as the request scoped context.
 * From controllers down to clients, client interceptors etc the context object is called 'context'.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line camelcase
export const setTokens = (
  // eslint-disable-next-line camelcase
  { access_token, refresh_token, authSource = undefined }: any,
  context: { access_token: any; refresh_token: any; authSource: any },
) => {
  // eslint-disable-next-line camelcase
  context.access_token = access_token
  // eslint-disable-next-line no-param-reassign,camelcase
  context.refresh_token = refresh_token
  // eslint-disable-next-line no-param-reassign
  context.authSource = authSource
}

export const hasTokens = (context: { access_token: any; refresh_token: any }) =>
  Boolean(context && context.access_token && context.refresh_token)

export const getAccessToken = (context: { access_token: any }) =>
  context && context.access_token ? context.access_token : null

export const getRefreshToken = (context: { refresh_token: any }) =>
  context && context.refresh_token ? context.refresh_token : null

export const normalizeHeaderNames = (srcHeaders: { [x: string]: any }) =>
  Object.keys(srcHeaders).reduce(
    (previous, headerName) => ({
      ...previous,
      [headerName.toLowerCase()]: srcHeaders[headerName],
    }),
    {},
  )

export const copyNamedHeaders = (headerNames: any[], srcHeaders: { [x: string]: any }) =>
  headerNames.reduce((previous, name) => {
    if (srcHeaders[name]) {
      return {
        ...previous,
        [name]: srcHeaders[name],
      }
    }
    return previous
  }, {})

export const setRequestPagination = (context: { requestHeaders: any }, headers: { [x: string]: any }) => {
  const headerNames = ['page-offset', 'page-limit', 'sort-fields', 'sort-order']
  // eslint-disable-next-line no-param-reassign
  context.requestHeaders = copyNamedHeaders(headerNames, (headers && normalizeHeaderNames(headers)) || {})
}

export const getRequestPagination = (context: { requestHeaders: any }) => context.requestHeaders || {}

export const setResponsePagination = (context: { responseHeaders: any }, headers: { [x: string]: any }) => {
  const headerNames = ['page-offset', 'page-limit', 'sort-fields', 'sort-order', 'total-records']

  // eslint-disable-next-line no-param-reassign
  context.responseHeaders = copyNamedHeaders(headerNames, (headers && normalizeHeaderNames(headers)) || {})
}

interface PaginationHeaders {
  'page-offset'?: number
  'page-limit'?: number
  'sort-fields'?: string
  'sort-order'?: string
}

export const getPaginationForPageRequest = (
  {
    requestHeaders,
  }: {
    requestHeaders: PaginationHeaders
  },
  fieldMapper: (fieldName: string) => string = fieldName => fieldName,
): { page: number; size: number; sort?: string } => {
  if (!requestHeaders) return { page: 0, size: 20 }

  const pageOffset = requestHeaders['page-offset']
  const size: number = requestHeaders['page-limit'] || 20
  const page = Math.floor(pageOffset / size) || 0
  const sortFields = requestHeaders['sort-fields']
  const sortOrder = requestHeaders['sort-order'] ?? 'ASC'
  const sortFieldsMapped = sortFields && sortFields.split(',').map(fieldMapper).join(',')
  const sort = sortFieldsMapped && `${sortFieldsMapped},${sortOrder}`

  return { page, size, sort }
}

export const setPaginationFromPageRequest = (context: any, { totalElements, pageable: { pageSize, offset } }: any) => {
  const c = context
  c.responseHeaders = { 'page-offset': offset, 'page-limit': pageSize, 'total-records': totalElements }
}

export const getResponsePagination = (context: { responseHeaders: any }) => context.responseHeaders || {}

// eslint-disable-next-line @typescript-eslint/ban-types
export const setCustomRequestHeaders = (context: { customRequestHeaders: {} }, headers: { [x: string]: any }) => {
  // eslint-disable-next-line no-param-reassign
  context.customRequestHeaders = (headers && normalizeHeaderNames(headers)) || {}
}

export const getCustomRequestHeaders = (context: { customRequestHeaders: any }) => context.customRequestHeaders || {}

export default {
  setTokens,
  hasTokens,
  getAccessToken,
  getRefreshToken,
  setRequestPagination,
  getRequestPagination,
  setResponsePagination,
  getResponsePagination,
  setCustomRequestHeaders,
  getCustomRequestHeaders,
  getPaginationForPageRequest,
  setPaginationFromPageRequest,
}
