/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction } from 'express'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: {
        [key: string]: any
      }
    }
    interface Response {
      context: {
        [key: string]: any
      }
    }
  }
}
const expressContext = () => (req: Express.Request, res: Express.Response, next: NextFunction) => {
  req.context = {}
  res.context = {}
  next()
}
export default expressContext
