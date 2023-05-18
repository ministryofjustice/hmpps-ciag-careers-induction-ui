import type { RequestHandler } from 'express'

// Gets field on body and converts to an array if only one value is found
const parseCheckBoxValue =
  (fieldName: string): RequestHandler =>
  async (req, res, next): Promise<void> => {
    req.body[fieldName] =
      req.body[fieldName] && !Array.isArray(req.body[fieldName]) ? [req.body[fieldName]] : req.body[fieldName]

    next()
  }

export default parseCheckBoxValue
