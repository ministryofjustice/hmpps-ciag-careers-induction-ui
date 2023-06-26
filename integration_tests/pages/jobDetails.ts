import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobDetailsPage extends Page {
  roleField = (): PageElement => cy.get('#jobRole')

  rolePageErrorMessage = (): PageElement => cy.get('[href="#jobRole"]')

  roleFieldErrorMessage = (): PageElement => cy.get('#jobRole-error')

  detailsField = (): PageElement => cy.get('#jobDetails')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#jobDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#jobDetails-error')
}
