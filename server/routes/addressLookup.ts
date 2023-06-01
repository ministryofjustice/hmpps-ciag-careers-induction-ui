export default {
  prisonerSearch: () => '/',
  workPlan: (id: string, tab = 'overview') => `/plan/${id}/view/${tab}`,
  createPlan: {
    checkAnswers: (id: string) => `/plan/create/${id}/check-answers`,
    hopingToGetWork: (id: string) => `/plan/create/${id}/hoping-to-get-work`,
    qualifications: (id: string, mode = 'new') => `/plan/create/${id}/qualifications/${mode}`,
    whyNoWork: (id: string, mode = 'new') => `/plan/create/${id}/why-no-work/${mode}`,
    educationLevel: (id: string, mode = 'new') => `/plan/create/${id}/education-level/${mode}`,
    otherQualifications: (id: string, mode = 'new') => `/plan/create/${id}/other-qualifications/${mode}`,
    qualificationLevel: (id: string, mode = 'new') => `/plan/create/${id}/qualification-level/${mode}`,
  },
}
