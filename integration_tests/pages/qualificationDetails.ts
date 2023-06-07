import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class QualificationDetailsPage extends Page {
  subjectField = (): PageElement => cy.get('#qualificationSubject')

  subjectPageErrorMessage = (): PageElement => cy.get('[href="#qualificationSubject"]')

  subjectFieldErrorMessage = (): PageElement => cy.get('#qualificationSubject-error')

  gradeField = (): PageElement => cy.get('#qualificationGrade')

  gradePageErrorMessage = (): PageElement => cy.get('[href="#qualificationGrade"]')

  gradeFieldErrorMessage = (): PageElement => cy.get('#qualificationGrade-error')
}
