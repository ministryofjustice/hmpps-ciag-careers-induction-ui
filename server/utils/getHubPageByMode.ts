import addressLookup from '../routes/addressLookup'

const getHubPageByMode = (mode: string, id: string) =>
  mode === 'update' ? addressLookup.learningPlan.profile(id) : addressLookup.createPlan.checkYourAnswers(id)

export default getHubPageByMode
