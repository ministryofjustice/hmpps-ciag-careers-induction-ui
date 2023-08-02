import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class TypeOfWorkExperiencePage extends Page {
  checkboxField = (): PageElement => cy.get('#typeOfWorkExperience')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#typeOfWorkExperienceOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#typeOfWorkExperience"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#typeOfWorkExperience-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#typeOfWorkExperienceOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#typeOfWorkExperienceOther-error')
}
