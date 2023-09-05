import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class InPrisonEducationPage extends Page {
  checkboxField = (): PageElement => cy.get('#inPrisonEducation')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#inPrisonEducationOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#inPrisonEducation"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#inPrisonEducation-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#inPrisonEducationOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#inPrisonEducationOther-error')
}
