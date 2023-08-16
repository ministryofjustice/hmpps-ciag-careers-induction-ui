import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class TypeOfWorkExperiencePage extends Page {
  checkboxField = (): PageElement => cy.get('#reasonToNotGetWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#reasonToNotGetWorkOther')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#reasonToNotGetWork"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#reasonToNotGetWork-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#reasonToNotGetWorkOther"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#reasonToNotGetWorkOther-error')

  pageErrorMessage = (): PageElement => cy.get('[href="#reasonToNotGetWork"]')
}
