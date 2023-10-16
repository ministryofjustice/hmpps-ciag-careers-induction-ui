import CiagListPage from '../pages/ciagList'

const ciagListUrl = '/'
const ciagHomePageTitle = 'Manage learning and work progress'

context('Ciag list page', () => {
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

  it('Should display correct number of records on page', () => {
    cy.visit('/')

    const ciagListPage = new CiagListPage(ciagHomePageTitle)
    ciagListPage.tableData().then(offenders => {
      expect(offenders.length).equal(50)
    })
  })

  it('should display the table headers correctly', () => {
    cy.get('#view-offender thead tr.govuk-table__row')
      .should('contain', 'Prisoner')
      .and('contain', 'Location')
      .and('contain', 'Release date')
      .and('contain', 'Entered prison on')
      .and('contain', 'Status')
  })

  it('Should have correct number of columns to display', () => {
    cy.visit(ciagListUrl)
    const ciagListPage = new CiagListPage(ciagHomePageTitle)

    ciagListPage.columnLabels().then(labels => {
      expect(labels[0]).to.deep.equal({
        viewLink: undefined,
        lastName: '',
        releaseDate: '',
        receptionDate: '',
      })
    })
  })

  it('Should display the correct pagination when result set has more than 50 records ', () => {
    cy.visit(ciagListUrl)
    const ciagListPage = new CiagListPage(ciagHomePageTitle)

    ciagListPage.paginationResult().should('contain', 'Showing')
    ciagListPage.paginationResult().then(page => {
      expect(page[0].innerText).to.deep.equal('Showing 1 to 50 of 63 results')
    })
  })

  it('Should filter result to return 1 row corresponding to the name typed', () => {
    cy.visit(ciagListUrl)
    const ciagListPage = new CiagListPage(ciagHomePageTitle)

    ciagListPage.searchText().clear().type('wardel')
    ciagListPage.searchButton().click()
    cy.visit(`${ciagListUrl}?searchTerm=wardel`)

    cy.url().should('include', '?searchTerm=wardel')
    ciagListPage.tableData().then(offenders => {
      expect(offenders.length).equal(1)
    })
  })

  it('Should return empty table when offender name does not exist', () => {
    cy.visit(ciagListUrl)
    const ciagListPage = new CiagListPage(ciagHomePageTitle)

    ciagListPage.searchText().clear().type('unknown')
    ciagListPage.searchButton().click()
    cy.visit(`${ciagListUrl}?searchTerm=unknown`)

    cy.url().should('include', '?searchTerm=unknown')
    ciagListPage.spanMessage().should('contain', '0 results')
  })

  it('Should sort the result table in ascending order by lastname', () => {
    cy.visit(ciagListUrl)
    const ciagListPage = new CiagListPage(ciagHomePageTitle)
    ciagListPage.tableData().then(offenders => {
      expect(offenders[0].viewLink).to.contain('/plan/G0000AB/view/overview')
      expect(offenders[0].lastName).to.contain('Cattus')
    })

    cy.get('#lastName-sort-action').click()
    cy.visit(`${ciagListUrl}?sort=lastName&order=ascending`)

    ciagListPage.tableData().then(offenders => {
      expect(offenders[0].viewLink).to.contain('/plan/G0000UV/view/overview')
      expect(offenders[0].lastName).to.contain('Bell')
      // expect(offenders[0].location).to.contain('Bell')
      expect(offenders[0].releaseDate).to.contain('28 May 2023')
      expect(offenders[0].receptionDate).to.contain('19 Mar 2023')
      expect(offenders[0].status).to.contain('Needs plan')
    })
    cy.url().should('include', '?sort=lastName&order=ascending')
  })
})
