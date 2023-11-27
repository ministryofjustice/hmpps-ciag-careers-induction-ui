/* eslint-disable @typescript-eslint/no-explicit-any */
import formatDateToyyyyMMdd from './formatDateToyyyyMMdd'

describe('formatDateToyyyyMMdd', () => {
  it('should return "N/A" if the input is falsy', () => {
    const result = formatDateToyyyyMMdd(null)

    expect(result).toBe('N/A')
  })

  it('should return formatted date string in "yyyy-MM-dd" format', () => {
    const inputDate = '2023-01-01'
    const result = formatDateToyyyyMMdd(inputDate)

    expect(result).toBe('2023-01-01')
  })

  it('should pad single-digit month and day with leading zeros', () => {
    const inputDate = '2023-09-05'
    const result = formatDateToyyyyMMdd(inputDate)

    expect(result).toBe('2023-09-05')
  })

  it('should return "N/A" if an error occurs during date formatting', () => {
    const inputDate = 'invalid-date-string'
    const result = formatDateToyyyyMMdd(inputDate)

    expect(result).toBe('N/A')
  })

  it('should handle falsy values during date formatting and return "N/A"', () => {
    const result = formatDateToyyyyMMdd(undefined)

    expect(result).toBe('N/A')
  })
})
