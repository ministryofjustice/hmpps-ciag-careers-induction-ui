/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import formatDateStringToddMMMyyyyHHmm from './formatDateStringToddMMMyyyyHHmm'

jest.mock('date-fns', () => ({
  format: jest.fn(),
}))

describe('formatDateStringToddMMMyyyyHHmm', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return "N/A" if params.value is falsy', () => {
    const params: any = { value: null }

    const result = formatDateStringToddMMMyyyyHHmm(params)

    expect(result).toBe('N/A')
  })

  it('should return formatted date string using date-fns.format', () => {
    const inputDate = new Date('2023-01-01T12:34:56')
    const params: any = { value: inputDate }

    ;(format as any).mockReturnValue('01 Jan 2023 12:34')

    const result = formatDateStringToddMMMyyyyHHmm(params)

    expect(result).toBe('01 Jan 2023 12:34')
    expect(format).toHaveBeenCalledWith(inputDate, 'dd MMM yyyy HH:mm')
  })

  it('should handle falsy values during date formatting and return "N/A"', () => {
    const params: any = { value: undefined }

    const result = formatDateStringToddMMMyyyyHHmm(params)

    expect(result).toBe('N/A')
  })
})
