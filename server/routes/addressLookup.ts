export default {
  ciagProfile: () => '/',
  prisonerSearch: () => '/',
  workPlan: (id: string, tab = 'overview') => `/plan/${id}/view/${tab}`,
  createPlan: {
    hopingToGetWork: (id: string) => `/plan/create/${id}/hoping-to-get-work`,
  },
}
