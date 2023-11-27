import formatShortDate from './formatShortDate'

describe('formatShortDate', () => {
  it('should return formatted short date string', () => {
    const inputDate = new Date('2023-01-01')
    const result = formatShortDate(inputDate)

    expect(result).toBe('1 January 2023')
  })

  it('should return "Invalid Date" for invalid date input', () => {
    const inputDate = new Date('invalid-date-string')
    const result = formatShortDate(inputDate)

    expect(result).toBe('Invalid Date')
  })

  it('should use the provided timeZone in formatting', () => {
    const inputDate = new Date('2023-01-01T12:00:00Z') // UTC time
    const result = formatShortDate(inputDate)

    // The expected output depends on the time zone, in this case, 'Europe/London'
    // It's recommended to adjust this expectation based on your actual time zone.
    expect(result).toBe('1 January 2023')
  })
})
