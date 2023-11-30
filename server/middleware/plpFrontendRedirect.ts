import type { RequestHandler } from 'express'
import addressLookup from '../routes/addressLookup'
import config from '../config'

export enum AddressLookupKey {
  ciagList = 'ciagList',
  workPlan = 'workPlan',
}

// Redirect to the plp equivilent URL if plpPagesEnabled toggle is enabled
const plpFrontendRedirect =
  (address: AddressLookupKey): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params

    if (config.featureToggles.plpPagesEnabled) {
      // Get the addresses that are valid
      const addresses = {
        ciagList: addressLookup.ciagList(),
        workPlan: addressLookup.workPlan(id),
      }

      res.redirect(addresses[address])
      return
    }

    next()
  }

export default plpFrontendRedirect
