import CuriousEsweService from '../../../services/curiousEsweService'

const getNeurodivergence = async (curiousEsweService: CuriousEsweService, username: string, id: string) => {
  try {
    return await curiousEsweService.getLearnerNeurodivergence(username, id)
  } catch (err) {
    // Handle no data
    if (err?.data?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getNeurodivergence
