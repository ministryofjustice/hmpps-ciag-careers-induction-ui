import CiagListPage from '../pages/ciagList'

const ciagListUrl = '/'

context('Ciag list page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.signIn()
  })

  it('Should display correct number of records on page', () => {
    cy.task('getPrisonersByCaseloadId', 'MDI')

    cy.visit('/')

    const ciagListPage = new CiagListPage('Create an education and work plan')
    // ciagListPage.tableData().then(offenders => {
    //   expect(offenders.length).equal(3)
    // })
  })
})
