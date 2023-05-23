import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class HopingToGetWorkPage extends Page {
  radioField = (): PageElement => cy.get('#hopingToGetWork')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  pageErrorMessage = (): PageElement => cy.get('[href="#hopingToGetWork"]')

  fieldErrorMessage = (): PageElement => cy.get('#hopingToGetWork-error')
}
