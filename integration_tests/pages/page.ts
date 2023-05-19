export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new (title?: string) => T, title?: string): T {
    return title ? new constructor(title) : new constructor()
  }

  constructor(private readonly title: string) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  heading = (): PageElement => cy.get('h1')

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  backLink = (): PageElement => cy.get('.govuk-back-link')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')
}
