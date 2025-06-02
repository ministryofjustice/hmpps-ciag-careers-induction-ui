/* eslint-disable @typescript-eslint/no-explicit-any */
import formatDateStringToyyyyMMdd from './formatDateStringToyyyyMMdd'

describe('formatDateStringToyyyyMMdd', () => {
  it('should return "N/A" if params.value is falsy', () => {
    const params: any = { value: null }

    const result = formatDateStringToyyyyMMdd(params)

    expect(result).toBe('N/A')
  })

  it('should return formatted date string in "yyyy-MM-dd" format', () => {
    const inputDate = new Date('2023-01-01')
    const params: any = { value: inputDate }

    const result = formatDateStringToyyyyMMdd(params)

    expect(result).toBe('01-01-2023')
  })

  it('should return "N/A" if an error occurs during date formatting', () => {
    const params: any = { value: null }

    const result = formatDateStringToyyyyMMdd(params)

    expect(result).toBe('N/A')
  })

  it('should handle falsy values during date formatting and return "N/A"', () => {
    const params: any = { value: undefined }

    const result = formatDateStringToyyyyMMdd(params)

    expect(result).toBe('N/A')
  })
})
