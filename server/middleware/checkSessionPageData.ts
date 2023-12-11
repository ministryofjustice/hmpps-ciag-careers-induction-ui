import type { RequestHandler } from 'express'
import { getSessionData } from '../utils'

// Checks required values are set for creation and update process, designed for page POSTS
// Designed to catch back clicks in browser that resubmit, avoids errors and improves user experience
const checkSessionPageData =
  (sessionPageKey: string): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params

    // If no pageDate redirect to get
    const data = getSessionData(req, [sessionPageKey, id, 'data'])
    if (!data) {
      res.redirect(req.originalUrl)
    }

    next()
  }

export default checkSessionPageData
