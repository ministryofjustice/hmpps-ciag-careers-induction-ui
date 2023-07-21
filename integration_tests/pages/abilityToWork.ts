import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class AbilityToWorkPage extends Page {
  checkboxField = (): PageElement => cy.get('#abilityToWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#abilityToWorkDetails')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#abilityToWork"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#abilityToWork-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#abilityToWorkDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#abilityToWorkDetails-error')
}
