import AllocationManagerService from '../../../services/allocationManagerService'

const getPomById = async (allocationManagerService: AllocationManagerService, username: string, id: string) => {
  try {
    // Get Pom
    return await allocationManagerService.getPomForOffender(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getPomById
