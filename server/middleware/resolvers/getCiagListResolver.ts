import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import Prisoner from '../../data/prisonerSearch/prisoner'
import CiagService from '../../services/ciagService'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'

// Gets prisoners list based on user's caseloadId parameter and puts it into request context
const getCiagListResolver =
  (
    prisonerSearchService: PrisonerSearchService,
    ciagService: CiagService,
    educationAndWorkPlanService: EducationAndWorkPlanService,
  ): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username, token } = res.locals.user
    const { userActiveCaseLoad } = res.locals

    try {
      // Get prisoners list
      const prisoners = await prisonerSearchService.getPrisonersByCaseloadID(username, userActiveCaseLoad.caseLoadId)
      const offenderIds = prisoners.content.map((p: { prisonerNumber: string }) => p.prisonerNumber)

      // Get progress
      const [ciagPlans, workPlans] = await Promise.all([
        ciagService.getCiagPlanList(token, offenderIds),
        educationAndWorkPlanService.getActionPlanList(token, offenderIds),
      ])

      // Set statuses
      const ciagList = prisoners.content.map((p: Prisoner) => {
        const ciagPlan = ciagPlans?.ciagProfileList.find(
          (a: { offenderId: string }) => a.offenderId === p.prisonerNumber,
        )
        const workPlan = workPlans?.actionPlanSummaries.find(
          (a: { prisonNumber: string }) => a.prisonNumber === p.prisonerNumber,
        )

        return {
          ...p,
          firstName: p.firstName.trim(),
          lastName: p.lastName.trim(),
          ciagStatus: !ciagPlan || !workPlan ? 'NEEDS_PLAN' : '',
          ciagPlanComplete: !!ciagPlan,
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
