import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class PersonalInterestsPage extends Page {
  checkboxField = (): PageElement => cy.get('#personalInterests')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#personalInterestsOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#personalInterests"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#personalInterests-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#personalInterestsOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#personalInterestsOther-error')
}
