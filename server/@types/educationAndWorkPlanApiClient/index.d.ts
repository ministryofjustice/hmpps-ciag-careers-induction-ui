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
}
