import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WorkProfilePage extends Page {
  tabOverview = (): PageElement => cy.get('[data-qa=tab-overview]')

  tabDetails = (): PageElement => cy.get('[data-qa=tab-details]')

  tabExperience = (): PageElement => cy.get('[data-qa=tab-experience]')

  tabContacts = (): PageElement => cy.get('[data-qa=tab-contacts]')

  tabTraining = (): PageElement => cy.get('[data-qa=tab-training]')

  overviewStatus = (): PageElement => cy.get('[data-qa=overview-status]')

  overviewCreatePlanLink = (): PageElement => cy.get('#overview-create-plan-link')
}
