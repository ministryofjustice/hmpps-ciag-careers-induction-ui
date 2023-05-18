import contextProperties from './contextProperties'
// eslint-disable-next-line import/no-cycle
import { ClientContext } from './oauthEnabledClient'

export const getHeaders = (context: string | ClientContext, resultsLimit?: number) => {
  // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line import/no-named-as-default-member
  const paginationHeaders = contextProperties.getRequestPagination(context)
  // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line import/no-named-as-default-member
  const customHeaders = contextProperties.getCustomRequestHeaders(context)
  // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line import/no-named-as-default-member
  const accessToken = contextProperties.getAccessToken(context)

  return {
    ...customHeaders,
    ...paginationHeaders,
    ...(resultsLimit && { 'page-limit': resultsLimit.toString() }),
    ...(accessToken && { authorization: `Bearer ${accessToken}` }),
  }
}

export default {
  getHeaders,
}
