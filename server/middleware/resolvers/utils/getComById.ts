import CommunityService from '../../../services/communityService'

const getComById = async (communityService: CommunityService, username: string, id: string) => {
  try {
    // Get Com
    return await communityService.getComForOffender(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getComById
