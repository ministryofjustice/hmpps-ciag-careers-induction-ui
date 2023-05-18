import decorators from './axios-config-decorators'
import contextProperties from './contextProperties'

describe('Axios request configuration decorator tests', () => {
  it('should return paging and auth headers', () => {
    const context = {}
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setTokens({ access_token: 'access', refresh_token: 'refresh' }, context)
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setRequestPagination(context, { 'page-limit': 5 })

    // eslint-disable-next-line import/no-named-as-default-member
    const headers = decorators.getHeaders(context)
    expect(headers).toEqual({ authorization: 'Bearer access', 'page-limit': 5 })
  })

  it('should override page limit header', () => {
    const context = {}
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setTokens({ access_token: 'access', refresh_token: 'refresh' }, context)
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setRequestPagination(context, { 'page-limit': '5' })

    // eslint-disable-next-line import/no-named-as-default-member
    const headers = decorators.getHeaders(context, 500)
    expect(headers).toEqual({ authorization: 'Bearer access', 'page-limit': '500' })
  })

  it('should exclude authorization header if not required', () => {
    const context = {}
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setRequestPagination(context, { 'page-limit': '5' })

    // eslint-disable-next-line import/no-named-as-default-member
    const headers = decorators.getHeaders(context)
    expect(headers).toEqual({ 'page-limit': '5' })
  })

  it('should include custom headers', () => {
    const context = {}
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setTokens({ access_token: 'access', refresh_token: 'refresh' }, context)
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setRequestPagination(context, { 'page-limit': '5' })
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setCustomRequestHeaders(context, { 'CUSTOM-HeADer': 'Custom-Value' })

    // eslint-disable-next-line import/no-named-as-default-member
    const headers = decorators.getHeaders(context)
    expect(headers).toEqual({ authorization: 'Bearer access', 'page-limit': '5', 'custom-header': 'Custom-Value' })
  })

  it('should not override other headers with custom headers', () => {
    const context = {}
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setTokens({ access_token: 'access', refresh_token: 'refresh' }, context)
    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setRequestPagination(context, { 'page-limit': '5' })

    // eslint-disable-next-line import/no-named-as-default-member,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/no-named-as-default-member
    contextProperties.setCustomRequestHeaders(context, {
      authorization: 'rogue-value',
      'page-limit': '555',
    })

    // eslint-disable-next-line import/no-named-as-default-member
    const headers = decorators.getHeaders(context)
    expect(headers).toEqual({ authorization: 'Bearer access', 'page-limit': '5' })
  })
})
