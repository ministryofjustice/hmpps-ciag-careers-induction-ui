import KeyworkerService from '../../../services/keyworkerService'

// Gets keyworker based on id
const getKeyworkerById = async (keyworkerService: KeyworkerService, username: string, id: string) => {
  try {
    // Get keyworker
    return await keyworkerService.getKeyworkerForOffender(username, id)
  } catch (err) {
    // Swallow not found errors
    if (err?.data?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getKeyworkerById
