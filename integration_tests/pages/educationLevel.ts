import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class EducationLevelPage extends Page {
  radioField = (): PageElement => cy.get('#educationLevel')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  pageErrorMessage = (): PageElement => cy.get('[href="#educationLevel"]')

  fieldErrorMessage = (): PageElement => cy.get('#educationLevel-error')
}
