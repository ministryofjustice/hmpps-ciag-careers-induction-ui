import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WorkInterestsPage extends Page {
  checkboxField = (): PageElement => cy.get('#workInterests')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#workInterestsOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#workInterests"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#workInterests-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#workInterestsOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#workInterestsOther-error')
}
