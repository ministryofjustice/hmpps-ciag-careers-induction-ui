import TypeOfWorkValue from '../enums/typeOfWorkValue'

export default {
  prisonerSearch: () => '/',
  workPlan: (id: string, tab = 'overview') => `/plan/${id}/view/${tab}`,
  createPlan: {
    checkAnswers: (id: string) => `/plan/create/${id}/check-answers`,
    hopingToGetWork: (id: string) => `/plan/create/${id}/hoping-to-get-work`,
    qualifications: (id: string, mode = 'new') => `/plan/create/${id}/qualifications-list/${mode}`,
    whyNoWork: (id: string, mode = 'new') => `/plan/create/${id}/why-no-work/${mode}`,
    educationLevel: (id: string, mode = 'new') => `/plan/create/${id}/education-level/${mode}`,
    otherQualifications: (id: string, mode = 'new') => `/plan/create/${id}/other-qualifications/${mode}`,
    qualificationLevel: (id: string, qualificationId: string, mode = 'new') =>
      `/plan/create/${id}/qualification-level/${qualificationId}/${mode}`,
    qualificationDetails: (id: string, qualificationId: string, mode = 'new') =>
      `/plan/create/${id}/qualification-details/${qualificationId}/${mode}`,
    hasWorkedBefore: (id: string, mode = 'new') => `/plan/create/${id}/has-worked-before/${mode}`,
    inPrisonWork: (id: string, mode = 'new') => `/plan/create/${id}/in-prison-work/${mode}`,
    typeOfWork: (id: string, mode = 'new') => `/plan/create/${id}/type-of-work/${mode}`,
    workInterests: (id: string, mode = 'new') => `/plan/create/${id}/work-interests/${mode}`,
    workDetails: (id: string, typeOfWork: TypeOfWorkValue, mode = 'new') =>
      `/plan/create/${id}/work-details/${typeOfWork.toLowerCase()}/${mode}`,
    jobOfParticularInterest: (id: string, mode = 'new') => `/plan/create/${id}/job-of-particular-interest/${mode}`,
  },
}
