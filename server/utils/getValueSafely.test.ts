import getValueSafely from './getValueSafely'

describe('getValueSafely', () => {
  const sampleObject = {
    name: 'John',
    age: 25,
    isStudent: true,
    details: {
      city: 'New York',
      hobbies: [] as Array<string>,
    },
  }

  it('should return the value at the specified path', () => {
    const result = getValueSafely(sampleObject, 'name')
    expect(result).toBe('John')
  })

  it('should return the default value if the path does not exist', () => {
    const result = getValueSafely(sampleObject, 'address', 'N/A')
    expect(result).toBe('N/A')
  })

  it('should return boolean values as-is', () => {
    const result = getValueSafely(sampleObject, 'isStudent')
    expect(result).toBe(true)
  })

  it('should return number values as-is', () => {
    const result = getValueSafely(sampleObject, 'age')
    expect(result).toBe(25)
  })

  it('should return the default value for empty objects', () => {
    const result = getValueSafely(sampleObject, 'details.hobbies', 'No Hobbies')
    expect(result).toBe('No Hobbies')
  })

  it('should return the default value for null or undefined objects', () => {
    const result = getValueSafely(null, 'details.hobbies', 'No Hobbies')
    expect(result).toBe('No Hobbies')
  })

  it('should return the default value for falsy paths', () => {
    const result = getValueSafely(sampleObject, '', 'Default')
    expect(result).toBe('Default')
  })
})
