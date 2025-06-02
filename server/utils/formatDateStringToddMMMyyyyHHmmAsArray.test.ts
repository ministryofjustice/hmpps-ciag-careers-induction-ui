/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns'
import formatDateStringToddMMMyyyyHHmmAsArray from './formatDateStringToddMMMyyyyHHmmAsArray'

jest.mock('date-fns', () => ({
  format: jest.fn(),
}))

describe('formatDateStringToddMMMyyyyHHmmAsArray', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return ["N/A"] if params.value is falsy', () => {
    const params: any = { value: null }

    const result = formatDateStringToddMMMyyyyHHmmAsArray(params)

    expect(result).toEqual(['N/A'])
  })

  it('should return an array with formatted date and time strings using date-fns.format', () => {
    const inputDate = new Date('2023-01-01T12:34:56')
    const params: any = { value: inputDate }

    ;(format as any).mockReturnValueOnce('01 Jan 2023')
    ;(format as any).mockReturnValueOnce('12:34')

    const result = formatDateStringToddMMMyyyyHHmmAsArray(params)

    expect(result).toEqual(['01 Jan 2023', '12:34'])
    expect(format).toHaveBeenCalledWith(inputDate, 'dd MMM yyyy')
    expect(format).toHaveBeenCalledWith(inputDate, 'HH:mm')
  })

  it('should handle falsy values during date formatting and return ["N/A"]', () => {
    const params: any = { value: undefined }

    const result = formatDateStringToddMMMyyyyHHmmAsArray(params)

    expect(result).toEqual(['N/A'])
  })
})
