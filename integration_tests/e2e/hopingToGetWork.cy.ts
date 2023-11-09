import HopingToGetWorkPage from '../pages/hopingToGetWork'

context('Hoping to get work page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlanList')
    cy.task('getCiagPlanList')
    cy.task('getCiagPlan')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getPrisonersByCaseloadId', 'MDI')
    cy.signIn()
    cy.visit('/plan/create/G6115VJ/hoping-to-get-work/new')
  })

  it('Validation messages display when no value selected', () => {
    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.submitButton().click()

    hopingToGetWorkPage.pageErrorMessage().contains('Select whether Daniel Craig is hoping to get work')
    hopingToGetWorkPage.fieldErrorMessage().contains('Select whether Daniel Craig is hoping to get work')
  })

  it('New record - Select YES - navigates to qualifications page', () => {
    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('YES').click()
    hopingToGetWorkPage.submitButton().click()

    cy.url().should('include', 'qualifications-list/new')
  })

  it('New record - Select NO - navigates to why-no-work page', () => {
    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('NO').click()
    hopingToGetWorkPage.submitButton().click()

    cy.url().should('include', 'reason-to-not-get-work')
  })

  it('New record - Select NO_SURE - navigates to why-no-work page', () => {
    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('NOT_SURE').click()
    hopingToGetWorkPage.submitButton().click()

    cy.url().should('include', 'reason-to-not-get-work')
  })
})
