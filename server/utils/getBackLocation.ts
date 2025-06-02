import type { Request } from 'express'
import { getSessionData, setSessionData } from './session'
import { decryptUrlParameter } from './urlParameterEncryption'

interface getBackLocationArgs {
  req: Request
  defaultRoute: string
  page: string
  uid: string
}

// Handle back location logic and remember it
const getBackLocation = (config: getBackLocationArgs) => {
  const { req, page, uid, defaultRoute } = config
  let { from = '' } = req.query

  if (!from) {
    from = getSessionData(req, ['from', page, uid], '')
  } else {
    from = decryptUrlParameter(from.toString())
    setSessionData(req, ['from', page, uid], from)
  }

  return from ? decodeURIComponent(from && from.toString()) : defaultRoute
}

export default getBackLocation
