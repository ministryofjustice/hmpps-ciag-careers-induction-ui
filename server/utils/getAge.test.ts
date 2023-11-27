import getAge from './getAge'

describe('getAge', () => {
  it('should calculate the correct age for a past birthdate', () => {
    const birthdate = '1990-01-01'
    const result = getAge(birthdate)

    // Assuming the current date is '2023-01-01'
    expect(result).toBe(33)
  })

  it('should return NaN for an invalid date string', () => {
    const invalidDate = 'invalid-date'
    const result = getAge(invalidDate)

    expect(Number.isNaN(result)).toBe(true)
  })

  it('should return NaN for falsy date input', () => {
    const result = getAge(undefined)

    expect(Number.isNaN(result)).toBe(true)
  })
})
