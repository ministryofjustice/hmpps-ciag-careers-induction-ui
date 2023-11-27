/* eslint-disable @typescript-eslint/no-explicit-any */
import mapToQueryString from './mapToQueryString'
import arrayToQueryString from './arrayToQueryString'

jest.mock('./arrayToQueryString')

describe('mapToQueryString', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return an empty string for an empty object', () => {
    const result = mapToQueryString({})
    expect(result).toBe('')
  })

  it('should return a query string for a non-empty object with primitive values', () => {
    const params = {
      name: 'John',
      age: 25,
      isStudent: true,
    }

    const result = mapToQueryString(params)

    expect(result).toBe('name=John&age=25&isStudent=true')
  })

  it('should call arrayToQueryString for array values', () => {
    const params = {
      hobbies: ['reading', 'swimming'],
      interests: 'coding',
    }

    ;(arrayToQueryString as any).mockReturnValue('hobbies=reading&hobbies=swimming')

    const result = mapToQueryString(params)

    expect(result).toBe('hobbies=reading&hobbies=swimming&interests=coding')
    expect(arrayToQueryString).toHaveBeenCalledWith(params.hobbies, 'hobbies')
  })

  it('should encode values in the query string', () => {
    const params = {
      name: 'John Doe',
      location: 'New York',
    }

    const result = mapToQueryString(params)

    expect(result).toBe('name=John%20Doe&location=New%20York')
  })
})
