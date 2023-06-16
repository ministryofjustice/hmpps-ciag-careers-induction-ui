import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class HasWorkedBeforePage extends Page {
  radioField = (): PageElement => cy.get('#hasWorkedBefore')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  pageErrorMessage = (): PageElement => cy.get('[href="#hasWorkedBefore"]')

  fieldErrorMessage = (): PageElement => cy.get('#hasWorkedBefore-error')
}
