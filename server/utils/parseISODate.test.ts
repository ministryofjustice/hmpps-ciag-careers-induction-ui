import parseISODate from './parseISODate'

describe('parseISODate', () => {
  it('should parse ISO date strings', () => {
    const input = '2022-12-31T12:00:00Z'
    const result = parseISODate(input)

    expect(result.getDate()).toEqual(31)
    expect(result.getMonth()).toEqual(11)
    expect(result.getFullYear()).toEqual(2022)
  })
})
