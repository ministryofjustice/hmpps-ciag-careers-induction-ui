import crypto from 'crypto'

import uuidv4 from './guid'

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}))

describe('uuidv4', () => {
  it('should call crypto.randomUUID', () => {
    uuidv4()
    expect((crypto.randomUUID as jest.Mock).mock.calls.length).toBe(1)
  })

  it('should return the result of crypto.randomUUID', () => {
    const mockUUID = 'mock-uuid'
    ;(crypto.randomUUID as jest.Mock).mockReturnValue(mockUUID)

    const result = uuidv4()

    expect(result).toBe(mockUUID)
  })
})
