import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class CiagListPage extends Page {
  searchText = (): PageElement => cy.get('#searchTerm')

  searchButton = (): PageElement => cy.get('#searchButton')

  paginationResult = (): PageElement => cy.get('.moj-pagination__results')

  // spanMessage = (): PageElement => cy.get('.govuk-heading-m')

  headerRow = (): PageElement => cy.get('#view-offender thead tr.govuk-table__row')

  columnLabels = () =>
    cy
      .get('#view-offender')
      .find('.govuk-table__head tr th')
      .spread((...cols) =>
        cols.map(col => {
          const tc = Cypress.$(col).find('td.govuk-table__header')
          return {
            viewLink: Cypress.$(tc[0]).find('a').attr('href'),
            lastName: Cypress.$(tc[0]).text(),
            releaseDate: Cypress.$(tc[1]).text(),
            receptionDate: Cypress.$(tc[2]).text(),
          }
        }),
      )

  tableData = () =>
    cy
      .get('#view-offender')
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            viewLink: Cypress.$(tds[0]).find('a').attr('href'),
            lastName: Cypress.$(tds[0]).text(),
            releaseDate: Cypress.$(tds[1]).text(),
            receptionDate: Cypress.$(tds[2]).text(),
          }
        }),
      )

  pagination = () =>
    cy
      .get('.moj-pagination')
      .find('.moj-pagination__list li')
      .spread((...items) =>
        items.map(pageElement => {
          const ele = Cypress.$(pageElement).find('moj-pagination__item moj-pagination__item--active')
          return {
            first: ele.find('arial-label'),
            // next: Cypress.$(ele[1]).find('a').attr('href'),
          }
        }),
      )
}
