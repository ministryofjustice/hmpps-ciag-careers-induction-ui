import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import Prisoner from '../../data/prisonerSearch/prisoner'
import CiagService from '../../services/ciagService'

// Gets prisoners list based on user's caseloadId parameter and puts it into request context
const getCiagListResolver =
  (prisonerSearchService: PrisonerSearchService, ciagService: CiagService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username, token } = res.locals.user
    const { userActiveCaseLoad } = res.locals

    try {
      // Get prisoners list
      const prisoners = await prisonerSearchService.getPrisonersByCaseloadID(username, userActiveCaseLoad.caseLoadId)

      // Get work plans
      const offenderIds = prisoners.content.map((p: { prisonerNumber: string }) => p.prisonerNumber)
      const workPlans = await ciagService.getCiagPlanList(token, offenderIds)

      // Set statuses
      const ciagList = prisoners.content.map((p: Prisoner) => {
        const plan = workPlans?.ciagPlans.find((a: { offenderId: string }) => a.offenderId === p.prisonerNumber)

        return {
          ...p,
          firstName: p.firstName.trim(),
          lastName: p.lastName.trim(),
          status: !plan ? 'NEEDS_PLAN' : '',
        }
      })

      prisoners.content = ciagList
      req.context.ciagList = prisoners

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCiagListResolver
