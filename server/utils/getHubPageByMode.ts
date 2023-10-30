import addressLookup from '../routes/addressLookup'

const getHubPageByMode = (mode: string, id: string, tab?: string) =>
  mode === 'update' ? addressLookup.learningPlan.profile(id, tab) : addressLookup.createPlan.checkYourAnswers(id)

export default getHubPageByMode
