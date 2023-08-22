import CiagPlan from '../interfaces/ciagPlan'
import UpdateCiagPlanArgs from '../interfaces/updateCiagPlanArgs'

export default class UpdateCiagPlanRequest {
  constructor(data: UpdateCiagPlanArgs, existingProfile: CiagPlan) {
    const now = new Date()
    const isoString = now.toISOString()

    this.offenderId = existingProfile.offenderId

    this.modifiedBy = data.currentUser
    this.modifiedDateTime = isoString
  }

  // Properties
  offenderId: string

  modifiedBy: string

  modifiedDateTime: string
}
