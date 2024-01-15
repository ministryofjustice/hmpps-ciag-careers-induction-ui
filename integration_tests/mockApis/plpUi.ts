import { stubFor } from './wiremock'

const stubPlpPrisonListPageUi = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html lang="en"><head><title>Mock PLP UI - Prisoner List Page</title></head><body><h1>PLP Prisoner List Page</h1><span class="govuk-visually-hidden" id="pageId" data-qa="plp-prisoner-list-page"></span></body></html>',
    },
  })

export default { stubPlpPrisonListPageUi }
