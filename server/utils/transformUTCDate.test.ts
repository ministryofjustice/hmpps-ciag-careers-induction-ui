/* eslint-disable @typescript-eslint/no-explicit-any */
import parseUTCDate from './parseUTCDate'
import transformUTCDate from './transformUTCDate'

jest.mock('./parseUTCDate')

describe('transformUTCDate', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call parseUTCDate with the provided value', () => {
    const inputValue = '2023-01-01T12:34:56Z'
    const params: any = { value: inputValue }

    transformUTCDate(params)

    expect(parseUTCDate).toHaveBeenCalledWith(inputValue)
  })

  it('should return the parsed Date from parseUTCDate', () => {
    const inputValue = '2023-01-01T12:34:56Z'
    const params: any = { value: inputValue }

    const expectedDate = new Date(inputValue)
    ;(parseUTCDate as any).mockReturnValue(expectedDate)

    const result = transformUTCDate(params)

    expect(result).toEqual(expectedDate)
  })

  it('should return undefined if parseUTCDate returns undefined', () => {
    const params: any = { value: 'invalid-date-string' }

    ;(parseUTCDate as any).mockReturnValue(undefined)

    const result = transformUTCDate(params)

    expect(result).toBeUndefined()
  })

  it('should handle falsy values in params and return undefined', () => {
    const params: any = { value: null }

    const result = transformUTCDate(params)

    expect(result).toBeUndefined()
  })
})
