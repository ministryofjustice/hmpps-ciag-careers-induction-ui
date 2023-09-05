import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class InPrisonWorkPage extends Page {
  checkboxField = (): PageElement => cy.get('#inPrisonWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#inPrisonWorkOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#inPrisonWork"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#inPrisonWork-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#inPrisonWorkOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#inPrisonWorkOther-error')
}
