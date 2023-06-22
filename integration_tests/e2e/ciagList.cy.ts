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
    ciagListPage.tableData().then(offenders => {
      expect(offenders.length).equal(3)
    })
  })

  it('should display the table headers correctly', () => {
    cy.get('#view-offender thead tr.govuk-table__row')
      .should('contain', 'Prisoner')
      .and('contain', 'Release type and date')
      .and('contain', 'Entered prison on')
  })

  it('Should display the correct pagination when result set has more than 20 records ', () => {
    cy.visit(ciagListUrl)
    const ciagListPage = new CiagListPage('Create an education and work plan')
    ciagListPage.paginationResult().should('contain', 'Showing')
    ciagListPage.paginationResult().then(page => {
      expect(page[0].innerText).to.deep.equal('Showing 1 to 3 of 3 results')
    })
  })
})
