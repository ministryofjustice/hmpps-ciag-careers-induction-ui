import CuriousEsweService from '../../../services/curiousEsweService'

const getLearnerEducation = async (curiousEsweService: CuriousEsweService, username: string, id: string) => {
  try {
    return await curiousEsweService.getLearnerEducation(username, id)
  } catch (err) {
    // Handle no data
    if (err?.data?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getLearnerEducation
