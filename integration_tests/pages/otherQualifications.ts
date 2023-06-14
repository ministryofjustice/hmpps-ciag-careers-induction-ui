import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class OtherQualificationsPage extends Page {
  checkboxField = (): PageElement => cy.get('#otherQualifications')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#otherQualificationsDetails')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#otherQualifications"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#otherQualifications-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#otherQualificationsDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#otherQualificationsDetails-error')
}
