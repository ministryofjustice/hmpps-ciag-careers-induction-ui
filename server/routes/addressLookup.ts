import TypeOfWorkExperienceValue from '../enums/typeOfWorkExperienceValue'

export default {
  prisonerSearch: () => '/',
  workPlan: (id: string, tab = 'overview') => `/plan/${id}/view/${tab}`,
  createPlan: {
    checkYourAnswers: (id: string) => `/plan/create/${id}/check-your-answers`,
    hopingToGetWork: (id: string, mode = 'new') => `/plan/create/${id}/hoping-to-get-work/${mode}`,
    checkAnswers: (id: string) => `/plan/create/${id}/check-answers`,
    notHopingToGetWork: (id: string) => `/plan/create/${id}/not-hoping-to-get-work`,
    qualifications: (id: string, mode = 'new') => `/plan/create/${id}/qualifications-list/${mode}`,
    whyNoWork: (id: string, mode = 'new') => `/plan/create/${id}/why-no-work/${mode}`,
    educationLevel: (id: string, mode = 'new') => `/plan/create/${id}/education-level/${mode}`,
    additionalTraining: (id: string, mode = 'new') => `/plan/create/${id}/additional-training/${mode}`,
    qualificationLevel: (id: string, qualificationId: string, mode = 'new') =>
      `/plan/create/${id}/qualification-level/${qualificationId}/${mode}`,
    qualificationDetails: (id: string, qualificationId: string, mode = 'new') =>
      `/plan/create/${id}/qualification-details/${qualificationId}/${mode}`,
    hasWorkedBefore: (id: string, mode = 'new') => `/plan/create/${id}/has-worked-before/${mode}`,
    inPrisonWork: (id: string, mode = 'new') => `/plan/create/${id}/in-prison-work/${mode}`,
    inPrisonEducation: (id: string, mode = 'new') => `/plan/create/${id}/in-prison-education/${mode}`,
    typeOfWorkExperience: (id: string, mode = 'new') => `/plan/create/${id}/type-of-work-experience/${mode}`,
    workInterests: (id: string, mode = 'new') => `/plan/create/${id}/work-interests/${mode}`,
    workDetails: (id: string, typeOfWorkExperience: TypeOfWorkExperienceValue, mode = 'new') =>
      `/plan/create/${id}/work-details/${typeOfWorkExperience.toLowerCase()}/${mode}`,
    particularJobInterests: (id: string, mode = 'new') => `/plan/create/${id}/particular-job-interests/${mode}`,
    skills: (id: string, mode = 'new') => `/plan/create/${id}/skills/${mode}`,
    personalInterests: (id: string, mode = 'new') => `/plan/create/${id}/personal-interests/${mode}`,
    abilityToWork: (id: string, mode = 'new') => `/plan/create/${id}/ability-to-work/${mode}`,
  },
}
