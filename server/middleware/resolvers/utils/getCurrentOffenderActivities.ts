import _ from 'lodash'

import PrisonService from '../../../services/prisonService'

const getCurrentOffenderActivities = async (prisonService: PrisonService, username: string, id: string) => {
  try {
    const activitiesResult = await prisonService.getAllOffenderActivities(username, id)
    return _.get(activitiesResult, 'content', []).filter(
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
