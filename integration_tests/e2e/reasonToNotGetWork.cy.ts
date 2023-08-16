import ReasonToNotGetWork from '../pages/reasonToNotGetWork'

const pageTitle = "Why is Daniel Craig not hoping to get work when they're released?"

context('Not hoping to get work page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getPrisonersByCaseloadId', 'MDI')
  })

  it('Validation messages display when no value selected', () => {
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work')

    const reasonToNotGetWork = new ReasonToNotGetWork(
      `Why is Daniel Craig not hoping to get work when they're released?`,
    )

    reasonToNotGetWork.submitButton().click()

    reasonToNotGetWork.pageErrorMessage().contains('Select why Daniel Craig is not hoping to get work')
  })

  it('Select OTHER - no details given, display appropriate message', () => {
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work')

    const reasonToNotGetWork = new ReasonToNotGetWork(pageTitle)

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear()
    reasonToNotGetWork.submitButton().click()

    reasonToNotGetWork
      .detailsFieldErrorMessage()
      .should('contain', 'Enter why Daniel Craig is not hoping to get work when they’re released')
  })

  it('Select OTHER - details entered - navigate to qualifications page', () => {
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work')

    const reasonToNotGetWork = new ReasonToNotGetWork(pageTitle)

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear().type('other details')
    reasonToNotGetWork.submitButton().click()

    cy.visit('/plan/create/G6115VJ/qualifications-list/new')
  })

  it('Select OTHER - enter text with more characters than allowed', () => {
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work')

    const reasonToNotGetWork = new ReasonToNotGetWork(pageTitle)

    const longStr = 'x'.repeat(201)

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear().type(longStr)
    reasonToNotGetWork.submitButton().click()

    reasonToNotGetWork.detailsFieldErrorMessage().should('contain', 'Reason must be 200 characters or less')
  })
})
