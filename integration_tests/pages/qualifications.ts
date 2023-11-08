import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class QualificationsPage extends Page {
  addQualificationButton = (): PageElement => cy.get('#addQualification')

  removeQualificationButton = (id): PageElement => cy.get(`#remove-qualification-${id}`)
}
