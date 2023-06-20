import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class TypeOfWorkPage extends Page {
  checkboxField = (): PageElement => cy.get('#typeOfWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#typeOfWorkDetails')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#typeOfWork"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#typeOfWork-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#typeOfWorkDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#typeOfWorkDetails-error')
}
