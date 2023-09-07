import HopingToGetWorkPage from '../pages/hopingToGetWork'
import ReasonToNotGetWork from '../pages/reasonToNotGetWork'
import WantsToAddQualifications from '../pages/wantsToAddQualifications'

context('Wants to add qualifications page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlanList')
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

    const reasonToNotGetWork = new ReasonToNotGetWork(
      "Why is Daniel Craig not hoping to get work when they're released?",
    )

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear().type('other details')
    reasonToNotGetWork.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const wantsToAddQualifications = new WantsToAddQualifications("Daniel Craig's qualifications")

    wantsToAddQualifications.submitButton().click()

    wantsToAddQualifications
      .pageErrorMessage()
      .contains('Select whether Daniel Craig wants to record any other educational qualifications')
    wantsToAddQualifications
      .fieldErrorMessage()
      .contains('Select whether Daniel Craig wants to record any other educational qualifications')

    wantsToAddQualifications.submitButton().click()
  })

  it('New record - Select YES - navigates to type-of-work-experience page', () => {
    const wantsToAddQualifications = new WantsToAddQualifications("Daniel Craig's qualifications")

    wantsToAddQualifications.radioFieldValue('YES').click()
    wantsToAddQualifications.submitButton().click()

    cy.url().should('include', 'qualification-level')
  })

  it('New record - Select NO - navigates to work-interests page', () => {
    const wantsToAddQualifications = new WantsToAddQualifications("Daniel Craig's qualifications")

    wantsToAddQualifications.radioFieldValue('NO').click()
    wantsToAddQualifications.submitButton().click()

    cy.url().should('include', 'additional-training')
  })
})
