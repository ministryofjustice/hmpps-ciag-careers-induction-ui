import { Request } from 'express'
import { setSessionData, getSessionData, deleteSessionData } from './session'

describe('session data functions', () => {
  let req: Request

  beforeEach(() => {
    req = { session: { data: {} } } as Request
  })

  it('should set session data', () => {
    const keys = ['key1', 'key2']
    const newValue = 'new value'
    setSessionData(req, keys, newValue)
    expect(req.session.data[keys.join('_')]).toBe(newValue)
  })

  it('should get session data', () => {
    const keys = ['key1', 'key2']
    const defaultValue = 'default value'
    const value = 'test value'
    req.session.data[keys.join('_')] = value
    expect(getSessionData(req, keys, defaultValue)).toBe(value)
    expect(getSessionData(req, ['nonexistentkey'], defaultValue)).toBe(defaultValue)
  })

  it('should delete session data', () => {
    const keys = ['key1', 'key2']
    const value = 'test value'
    req.session.data[keys.join('_')] = value
    expect(req.session.data[keys.join('_')]).toBe(value)
    deleteSessionData(req, keys)
    expect(req.session.data[keys.join('_')]).toBeUndefined()
  })
})
