import arrayToQueryString from './arrayToQueryString'

describe('arrayToQueryString', () => {
  it('should return an empty string if the input array is undefined or null', () => {
    expect(arrayToQueryString(undefined, 'key')).toBe('')
    expect(arrayToQueryString(null, 'key')).toBe('')
  })

  it('should return an empty string if the input array is empty', () => {
    expect(arrayToQueryString([], 'key')).toBe('')
  })

  it('should create a query string with encoded values for string array', () => {
    const inputArray = ['value1', 'value2']
    const key = 'param'
    const queryString = arrayToQueryString(inputArray, key)

    expect(queryString).toBe(`param=value1&param=value2`)
  })

  it('should create a query string with encoded values for number array', () => {
    const inputArray = [1, 2, 3]
    const key = 'param'
    const queryString = arrayToQueryString(inputArray, key)

    expect(queryString).toBe(`param=1&param=2&param=3`)
  })

  it('should create a query string with encoded values for boolean array', () => {
    const inputArray = [true, false]
    const key = 'param'
    const queryString = arrayToQueryString(inputArray, key)

    expect(queryString).toBe(`param=true&param=false`)
  })

  it('should handle mixed types in the array and encode values', () => {
    const inputArray = ['value1', 2, true]
    const key = 'param'
    const queryString = arrayToQueryString(inputArray, key)

    expect(queryString).toBe(`param=value1&param=2&param=true`)
  })

  it('should handle special characters in array values', () => {
    const inputArray = ['value with spaces', 'value&with=special&characters']
    const key = 'param'
    const queryString = arrayToQueryString(inputArray, key)

    expect(queryString).toBe(`param=value%20with%20spaces&param=value%26with%3Dspecial%26characters`)
  })
})
