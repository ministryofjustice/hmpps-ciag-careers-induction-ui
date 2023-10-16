/* eslint-disable @typescript-eslint/no-unused-vars */
import WorkPlanPage from '../pages/workPlan'

context('Work plan page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getPrisonersByCaseloadId', 'MDI')
    cy.task('getActionPlanList')
    cy.task('getCiagPlanList')
    cy.signIn()
  })

  it('No plan found', () => {
    cy.task('getPrisonerById', 'A00001A')
    cy.task('getCiagPlan', 'A00001A')

    cy.visit('/plan/A00001A/view/overview')
    const workProfilePage = new WorkPlanPage("Paris Jones's learning and work progress")

    workProfilePage.overviewCreatePlanLink().contains('make a progress plan now')
  })
})
