import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class InterestsPage extends Page {
  checkboxField = (): PageElement => cy.get('#interests')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#interestsDetails')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#interests"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#interests-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#interestsDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#interestsDetails-error')
}
