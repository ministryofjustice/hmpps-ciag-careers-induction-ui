/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkReadinessProfileStatus } from '../domain/types/profileStatus'

export default function getActionsRequired(offenderProfile: any) {
  const status = offenderProfile?.profileData.status

  switch (status) {
    case WorkReadinessProfileStatus.READY_TO_WORK:
      return {
        workTypeInterests: offenderProfile.profileData.supportAccepted.workInterests.workTypesOfInterest,
      }
    case WorkReadinessProfileStatus.SUPPORT_NEEDED: {
      const supportNeeded = offenderProfile.profileData.supportAccepted.actionsRequired.actions.filter(
        (x: any) => x.status !== 'COMPLETED',
      )
      return { supportNeeded: supportNeeded.map((x: { todoItem: any }) => x.todoItem) }
    }
    case WorkReadinessProfileStatus.NO_RIGHT_TO_WORK:
      return {
        noRightToWork: 'Does not have the right to work in the UK',
      }
    case WorkReadinessProfileStatus.NOT_STARTED:
      return status
    case WorkReadinessProfileStatus.SUPPORT_DECLINED: {
      const supportDeclined = offenderProfile.profileData.supportDeclined.supportToWorkDeclinedReason.map((x: any) => x)
      return {
        supportDeclinedReasons: supportDeclined,
      }
    }
    default:
      return 'N/A'
  }
}
