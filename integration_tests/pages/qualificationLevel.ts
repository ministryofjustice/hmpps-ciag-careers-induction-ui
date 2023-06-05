import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class QualificationLevelPage extends Page {
  radioField = (): PageElement => cy.get('#qualificationLevel')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  pageErrorMessage = (): PageElement => cy.get('[href="#qualificationLevel"]')

  fieldErrorMessage = (): PageElement => cy.get('#qualificationLevel-error')
}
