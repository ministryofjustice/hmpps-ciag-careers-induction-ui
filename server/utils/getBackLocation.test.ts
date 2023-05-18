import getBackLocation from './getBackLocation'
import { getSessionData, setSessionData } from './session'
import expressMocks from '../testutils/expressMocks'
import { encryptUrlParameter } from './urlParameterEncryption'

jest.mock('./session', () => ({
  getSessionData: jest.fn(),
  setSessionData: jest.fn(),
}))

describe('#getBackLocation', () => {
  const { req } = expressMocks()
  const page = 'test-page'
  const uid = 'test-uid'
  const defaultRoute = '/'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return default route if "from" query param is not set', () => {
    req.query = {}

    const result = getBackLocation({ req, page, uid, defaultRoute })
    expect(result).toEqual(defaultRoute)
    expect(getSessionData).toHaveBeenCalledWith(req, ['from', page, uid], '')
    expect(setSessionData).not.toHaveBeenCalled()
  })

  it('should return "from" query param value if it is set', () => {
    const from = '/previous-page'
    req.query = { from: encryptUrlParameter(from) }

    const result = getBackLocation({ req, page, uid, defaultRoute })
    expect(result).toEqual('/previous-page')
    expect(getSessionData).not.toHaveBeenCalled()
    expect(setSessionData).toHaveBeenCalledWith(req, ['from', page, uid], from)
  })

  it('should decode URI component of "from" value before returning it', () => {
    const from = '/previous/page?param=value'
    req.query = { from: encryptUrlParameter(from) }

    const result = getBackLocation({ req, page, uid, defaultRoute })
    expect(result).toEqual('/previous/page?param=value')
    expect(getSessionData).not.toHaveBeenCalled()
    expect(setSessionData).toHaveBeenCalledWith(req, ['from', page, uid], from)
  })
})
