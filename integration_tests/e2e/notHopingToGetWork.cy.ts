import NotHopingToGetWork from '../pages/notHopingToGetWork'

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

    const notHopingToGetWork = new NotHopingToGetWork(
      `Why is Daniel Craig not hoping to get work when they're released?`,
    )

    notHopingToGetWork.submitButton().click()

    notHopingToGetWork.pageErrorMessage().contains('Select why Daniel Craig is not hoping to get work')
  })

  it('Select OTHER - no details given, display appropriate message', () => {
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work')

    const notHopingToGetWork = new NotHopingToGetWork(pageTitle)

    notHopingToGetWork.checkboxFieldValue('OTHER').click()
    notHopingToGetWork.textareaField().clear()
    notHopingToGetWork.submitButton().click()

    notHopingToGetWork
      .detailsFieldErrorMessage()
      .should('contain', 'Enter why Daniel Craig is not hoping to get work when they’re released')
  })

  it('Select OTHER - details entered - navigate to qualifications page', () => {
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work')

    const notHopingToGetWork = new NotHopingToGetWork(pageTitle)

    notHopingToGetWork.checkboxFieldValue('OTHER').click()
    notHopingToGetWork.textareaField().clear().type('other details')
    notHopingToGetWork.submitButton().click()

    cy.visit('/plan/create/G6115VJ/qualifications-list/new')
  })

  it('Select OTHER - enter text with more characters than allowed', () => {
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work')

    const notHopingToGetWork = new NotHopingToGetWork(pageTitle)

    const longStr = 'x'.repeat(201)

    notHopingToGetWork.checkboxFieldValue('OTHER').click()
    notHopingToGetWork.textareaField().clear().type(longStr)
    notHopingToGetWork.submitButton().click()

    notHopingToGetWork.detailsFieldErrorMessage().should('contain', 'Reason must be 200 characters or less')
  })
})
