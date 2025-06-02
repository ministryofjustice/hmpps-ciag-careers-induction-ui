import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WantsToAddQualifications extends Page {
  radioField = (): PageElement => cy.get('#wantsToAddQualifications')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  pageErrorMessage = (): PageElement => cy.get('[href="#wantsToAddQualifications"]')

  fieldErrorMessage = (): PageElement => cy.get('#wantsToAddQualifications-error')
}
