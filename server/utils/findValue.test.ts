import findValue from './findValue'

describe('#findValue', () => {
  const lookup = {
    foo: 'bar',
    baz: 'qux',
    hello: 'world',
  }

  test('should return the value for the first matching key in the lookup object', () => {
    const result = findValue('foobar', lookup)
    expect(result).toBe('bar')
  })

  test('should return undefined if no matching key is found', () => {
    const result = findValue('xyz', lookup)
    expect(result).toBeUndefined()
  })

  test('should handle empty string input', () => {
    const result = findValue('', lookup)
    expect(result).toBeUndefined()
  })

  test('should handle empty lookup object', () => {
    const result = findValue('foo', {})
    expect(result).toBeUndefined()
  })
})
