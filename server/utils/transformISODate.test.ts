/* eslint-disable @typescript-eslint/no-explicit-any */
import parseISODate from './parseISODate'
import transformISODate from './transformISODate'

jest.mock('./parseISODate')

describe('transformISODate', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call parseISODate with the provided value', () => {
    const inputValue = '2023-01-01T12:34:56'
    const params: any = { value: inputValue }

    transformISODate(params)

    expect(parseISODate).toHaveBeenCalledWith(inputValue)
  })

  it('should return the parsed Date from parseISODate', () => {
    const inputValue = '2023-01-01T12:34:56'
    const params: any = { value: inputValue }

    const expectedDate = new Date(inputValue)
    ;(parseISODate as any).mockReturnValue(expectedDate)

    const result = transformISODate(params)

    expect(result).toEqual(expectedDate)
  })

  it('should return undefined if parseISODate returns undefined', () => {
    const params: any = { value: 'invalid-date-string' }

    ;(parseISODate as any).mockReturnValue(undefined)

    const result = transformISODate(params)

    expect(result).toBeUndefined()
  })

  it('should handle falsy values in params and return undefined', () => {
    const params: any = { value: null }

    const result = transformISODate(params)

    expect(result).toBeUndefined()
  })
})
