/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import formatDateStringTodMMMM from './formatDateStringTodMMMM'

jest.mock('date-fns', () => ({
  format: jest.fn(),
}))

describe('formatDateStringTodMMMM', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return "N/A" if params.value is falsy', () => {
    const params: any = { value: null }

    const result = formatDateStringTodMMMM(params)

    expect(result).toBe('N/A')
  })

  it('should return formatted date string using date-fns.format', () => {
    const inputDate = new Date('2023-01-01')
    const params: any = { value: inputDate }

    ;(format as any).mockReturnValue('1 January')

    const result = formatDateStringTodMMMM(params)

    expect(result).toBe('1 January')
    expect(format).toHaveBeenCalledWith(inputDate, 'd MMMM')
  })

  it('should return "N/A" if an error occurs during date formatting', () => {
    const params: any = { value: 'invalid-date-string' }

    ;(format as any).mockImplementation(() => {
      throw new Error('Invalid date')
    })

    const result = formatDateStringTodMMMM(params)

    expect(result).toBe('N/A')
    expect(format).toHaveBeenCalled()
  })

  it('should handle falsy values during date formatting and return "N/A"', () => {
    const params: any = { value: undefined }

    const result = formatDateStringTodMMMM(params)

    expect(result).toBe('N/A')
  })
})
