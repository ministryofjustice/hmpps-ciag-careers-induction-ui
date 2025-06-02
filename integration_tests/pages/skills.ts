import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class SkillsPage extends Page {
  checkboxField = (): PageElement => cy.get('#skills')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#skillsOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#skills"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#skills-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#skillsOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#skillsOther-error')
}
