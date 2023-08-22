import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class AdditionalTrainingPage extends Page {
  checkboxField = (): PageElement => cy.get('#additionalTraining')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#additionalTrainingOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#additionalTraining"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#additionalTraining-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#additionalTrainingOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#additionalTrainingOther-error')
}
