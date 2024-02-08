declare module 'educationAndWorkPlanApiClient' {
  import { components } from '../educationAndWorkPlanApi'

  export type InductionResponse = components['schemas']['InductionResponse']
  export type PersonalSkill = components['schemas']['PersonalSkill']
  export type PersonalInterest = components['schemas']['PersonalInterest']
  export type FutureWorkInterest = components['schemas']['FutureWorkInterest']
  export type PreviousWorkExperience = components['schemas']['PreviousWorkExperience']
  export type InPrisonWorkInterest = components['schemas']['InPrisonWorkInterest']
  export type AchievedQualification = components['schemas']['AchievedQualification']
  export type InPrisonTrainingInterest = components['schemas']['InPrisonTrainingInterest']

  export type CreateInductionRequest = components['schemas']['CreateInductionRequest']
  export type CreateWorkOnReleaseRequest = components['schemas']['CreateWorkOnReleaseRequest']
  export type CreatePreviousQualificationsRequest = components['schemas']['CreatePreviousQualificationsRequest']
  export type CreatePreviousTrainingRequest = components['schemas']['CreatePreviousTrainingRequest']
  export type CreatePreviousWorkExperiencesRequest = components['schemas']['CreatePreviousWorkExperiencesRequest']
  export type CreateInPrisonInterestsRequest = components['schemas']['CreateInPrisonInterestsRequest']
  export type CreatePersonalSkillsAndInterestsRequest = components['schemas']['CreatePersonalSkillsAndInterestsRequest']
  export type CreateFutureWorkInterestsRequest = components['schemas']['CreateFutureWorkInterestsRequest']

  export type UpdateInductionRequest = components['schemas']['UpdateInductionRequest']
  export type UpdateWorkOnReleaseRequest = components['schemas']['UpdateWorkOnReleaseRequest']
  export type UpdatePreviousQualificationsRequest = components['schemas']['UpdatePreviousQualificationsRequest']
  export type UpdatePreviousTrainingRequest = components['schemas']['UpdatePreviousTrainingRequest']
  export type UpdatePreviousWorkExperiencesRequest = components['schemas']['UpdatePreviousWorkExperiencesRequest']
  export type UpdateInPrisonInterestsRequest = components['schemas']['UpdateInPrisonInterestsRequest']
  export type UpdatePersonalSkillsAndInterestsRequest = components['schemas']['UpdatePersonalSkillsAndInterestsRequest']
  export type UpdateFutureWorkInterestsRequest = components['schemas']['UpdateFutureWorkInterestsRequest']
}
