import type { RequestHandler } from 'express'
import CiagService from '../../services/ciagService'

const getCiagPlanByIdResolver =
  (ciagService: CiagService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      const plan = await ciagService.getCiagPlan(user.token, id)
      req.context.plan = plan

      next()
    } catch (err) {
      // Handle no prplanofile
      if (err?.data?.status === 400 && err?.data?.userMessage.indexOf('CIAG profile does not exist') > -1) {
        next()
        return
      }
      next(err)
    }
  }

export default getCiagPlanByIdResolver
