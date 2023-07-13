import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class ParticularJobInterestsPage extends Page {
  textField = (key: string): PageElement => cy.get(`#${key}`)

  textPageErrorMessage = (key: string): PageElement => cy.get(`[href="#${key}"]`)

  textFieldErrorMessage = (key: string): PageElement => cy.get(`#${key}-error`)
}
