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
}
