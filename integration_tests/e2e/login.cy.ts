import Page from '../pages/page'
import AuthSignInPage from '../pages/authSignIn'
import PlpPrisonerListPage from '../pages/plpPrisonerListPage'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Signed in user is redirected to PLPs Prisoner List page', () => {
    // Given
    cy.task('stubPlpPrisonListPageUi')
    cy.task('stubGetFrontEndComponents')

    // When
    cy.signIn()

    // Then
    Page.verifyOnPage(PlpPrisonerListPage)
  })
})
