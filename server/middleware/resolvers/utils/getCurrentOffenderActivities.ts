import PrisonService from '../../../services/prisonService'
import { getValueSafely } from '../../../utils'

const getCurrentOffenderActivities = async (prisonService: PrisonService, username: string, id: string) => {
  try {
    const activitiesResult = await prisonService.getAllOffenderActivities(username, id)
    return getValueSafely(activitiesResult, 'content', []).filter(
      (a: { isCurrentActivity: boolean }) => a.isCurrentActivity === true,
    )
  } catch (err) {
    // Handle no data
    if (err?.data?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getCurrentOffenderActivities
