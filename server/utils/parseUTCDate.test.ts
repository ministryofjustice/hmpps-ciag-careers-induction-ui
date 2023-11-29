import parseUTCDate from './parseUTCDate'

describe('parseUTCDate', () => {
  it('should parse UTC date strings', () => {
    const input = '31/12/2022'
    const result = parseUTCDate(input)

    expect(result.getDate()).toEqual(31)
    expect(result.getMonth()).toEqual(11)
    expect(result.getFullYear()).toEqual(2022)
  })
})
