import HopingToGetWorkPage from '../pages/hopingToGetWork'
import ReasonToNotGetWork from '../pages/reasonToNotGetWork'

const pageTitle = 'What could stop Daniel Craig working when they are released?'

context('Not hoping to get work page', () => {
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
    cy.task('getLearnerEducation')
    cy.task('getPrisonersByCaseloadId', 'MDI')
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work/new')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('NOT_SURE').click()
    hopingToGetWorkPage.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const reasonToNotGetWork = new ReasonToNotGetWork(`What could stop Daniel Craig working when they are released?`)

    reasonToNotGetWork.submitButton().click()

    reasonToNotGetWork.pageErrorMessage().contains('Select why Daniel Craig is not hoping to get work')
  })

  it('Select OTHER - no details given, display appropriate message', () => {
    const reasonToNotGetWork = new ReasonToNotGetWork(pageTitle)

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear()
    reasonToNotGetWork.submitButton().click()

    reasonToNotGetWork
      .detailsFieldErrorMessage()
      .should('contain', "Enter why Daniel Craig is not hoping to get work when they're released")
  })

  it('Select OTHER - enter text with more characters than allowed', () => {
    const reasonToNotGetWork = new ReasonToNotGetWork(pageTitle)

    const longStr = 'x'.repeat(201)

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear().type(longStr)
    reasonToNotGetWork.submitButton().click()

    reasonToNotGetWork.detailsFieldErrorMessage().should('contain', 'Reason must be 200 characters or less')
  })

  it('Select OTHER - details entered - navigate to qualifications page', () => {
    const reasonToNotGetWork = new ReasonToNotGetWork(pageTitle)

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear().type('other details')
    reasonToNotGetWork.submitButton().click()

    cy.visit('/plan/create/G6115VJ/wants-to-add-qualifications/new')
  })
})
