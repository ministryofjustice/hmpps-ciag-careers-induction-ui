import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class PersonalInterestsPage extends Page {
  checkboxField = (): PageElement => cy.get('#personalInterests')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#personalInterestsDetails')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#personalInterests"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#personalInterests-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#personalInterestsDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#personalInterestsDetails-error')
}
