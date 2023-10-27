import HopingToGetWorkPage from '../pages/hopingToGetWork'
import QualificationsPage from '../pages/qualifications'

context('Update functionality', () => {
  const longStr = 'x'.repeat(201)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getActionPlanList')
    cy.task('getCiagPlanList')
    cy.task('getCiagPlan')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.task('getPrisonersByCaseloadId', 'MDI')
    cy.task('getPrisonerById', 'A3260DZ')
    cy.task('getCiagPlan', 'A3260DZ')
    cy.signIn()
  })

  it('Exisiting plan - Hoping to get work page', () => {
    cy.visit('/plan/create/A3260DZ/hoping-to-get-work/update')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Joe Bloggs hoping to get work when they're released?")

    // check value
    hopingToGetWorkPage.radioFieldValue('YES').should('be.checked')

    // change value
    hopingToGetWorkPage.radioFieldValue('NO').click()

    // submit
    hopingToGetWorkPage.submitButton().click()

    // check destination, change to new
    cy.url().should('include', '/reason-to-not-get-work/new')
  })

  it('Exisiting plan - Qualifications page - Submit', () => {
    cy.visit('/plan/create/A3260DZ/qualifications-list/update')

    const qualificationsPage = new QualificationsPage("Joe Bloggs's qualifications")

    // submit
    qualificationsPage.submitButton().click()

    // check destination, change to new
    cy.url().should('include', '/plan/A3260DZ/view/overview')
  })
})
