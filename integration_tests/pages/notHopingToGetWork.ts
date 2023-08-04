import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class TypeOfWorkExperiencePage extends Page {
  checkboxField = (): PageElement => cy.get('#notHopingToGetWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#notHopingToGetWorkDetails')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#notHopingToGetWork"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#notHopingToGetWork-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#notHopingToGetWorkDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#notHopingToGetWorkDetails-error')

  pageErrorMessage = (): PageElement => cy.get('[href="#notHopingToGetWork"]')
}
