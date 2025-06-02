import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class CheckYourAnswersPage extends Page {
  constructor(title?: string) {
    super(title || 'Check and save your answers')
  }

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  hopingToGetWork = (): PageElement => cy.get('[data-qa=hopingToGetWork]')

  hopingToGetWorkLink = (): PageElement => cy.get('[data-qa=hopingToGetWorkLink]')

  reasonToNotGetWork = (): PageElement => cy.get('[data-qa=reasonToNotGetWork]')

  reasonToNotGetWorkItem = (index: number): PageElement => cy.get(`[data-qa=reasonToNotGetWork-${index}]`)

  reasonToNotGetWorkLink = (): PageElement => cy.get('[data-qa=reasonToNotGetWorkLink]')

  wantsToAddQualifications = (): PageElement => cy.get('[data-qa=wantsToAddQualifications]')

  wantsToAddQualificationsLink = (): PageElement => cy.get('[data-qa=wantsToAddQualificationsLink]')

  abilityToWork = (): PageElement => cy.get('[data-qa=abilityToWork]')

  abilityToWorkItem = (index: number): PageElement => cy.get(`[data-qa=abilityToWork-${index}]`)

  abilityToWorkLink = (): PageElement => cy.get('[data-qa=abilityToWorkLink]')

  hasWorkedBefore = (): PageElement => cy.get('[data-qa=hasWorkedBefore]')

  hasWorkedBeforeLink = (): PageElement => cy.get('[data-qa=hasWorkedBeforeLink]')

  typeOfWorkExperience = (): PageElement => cy.get('[data-qa=typeOfWorkExperience]')

  typeOfWorkExperienceItem = (index: number): PageElement => cy.get(`[data-qa=typeOfWorkExperience-${index}]`)

  typeOfWorkExperienceLink = (): PageElement => cy.get('[data-qa=typeOfWorkExperienceLink]')

  workExperience = (): PageElement => cy.get('[data-qa=workExperience]')

  workExperienceItemRole = (index: number): PageElement => cy.get(`[data-qa=workExperience-role-${index}]`)

  workExperienceItemDetails = (index: number): PageElement => cy.get(`[data-qa=workExperience-details-${index}]`)

  workExperienceItemLink = (index: number): PageElement => cy.get(`[data-qa=workExperience-link-${index}]`)

  workInterests = (): PageElement => cy.get('[data-qa=workInterests]')

  workInterestsItem = (index: number): PageElement => cy.get(`[data-qa=workInterests-${index}]`)

  workInterestsLink = (): PageElement => cy.get('[data-qa=workInterestsLink]')

  particularJobInterests = (): PageElement => cy.get('[data-qa=particularJobInterests]')

  particularJobInterestsItem = (index: number): PageElement => cy.get(`[data-qa=particularJobInterests-${index}]`)

  particularJobInterestsLink = (): PageElement => cy.get('[data-qa=particularJobInterestsLink]')

  skills = (): PageElement => cy.get('[data-qa=skills]')

  skillsItem = (index: number): PageElement => cy.get(`[data-qa=skills-${index}]`)

  skillsLink = (): PageElement => cy.get('[data-qa=skillsLink]')

  personalInterests = (): PageElement => cy.get('[data-qa=personalInterests]')

  personalInterestsItem = (index: number): PageElement => cy.get(`[data-qa=personalInterests-${index}]`)

  personalInterestsLink = (): PageElement => cy.get('[data-qa=personalInterestsLink]')

  educationLevel = (): PageElement => cy.get('[data-qa=educationLevel]')

  educationLevelLink = (): PageElement => cy.get('[data-qa=educationLevelLink]')

  qualifications = (): PageElement => cy.get('[data-qa=qualifications]')

  qualificationsLink = (): PageElement => cy.get('[data-qa=qualificationsLink]')

  personalInterestsItemField = (index: number, field: string): PageElement =>
    cy.get(`[data-qa=personalInterests-${field}-${index}]`)

  additionalTraining = (): PageElement => cy.get('[data-qa=additionalTraining]')

  additionalTrainingItem = (index: number): PageElement => cy.get(`[data-qa=additionalTraining-${index}]`)

  additionalTrainingLink = (): PageElement => cy.get('[data-qa=additionalTrainingLink]')

  inPrisonWork = (): PageElement => cy.get('[data-qa=inPrisonWork]')

  inPrisonWorkItem = (index: number): PageElement => cy.get(`[data-qa=inPrisonWork-${index}]`)

  inPrisonWorkLink = (): PageElement => cy.get('[data-qa=inPrisonWorkLink]')

  inPrisonEducation = (): PageElement => cy.get('[data-qa=inPrisonEducation]')

  inPrisonEducationItem = (index: number): PageElement => cy.get(`[data-qa=inPrisonEducation-${index}]`)

  inPrisonEducationLink = (): PageElement => cy.get('[data-qa=inPrisonEducationLink]')
}
