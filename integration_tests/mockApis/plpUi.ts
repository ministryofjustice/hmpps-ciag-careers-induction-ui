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

const stubPlpEducationAndTrainingPageUi = (id = 'A3260DZ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/plan/${id}/view/education-and-training`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html lang="en"><head><title>Mock PLP UI - Education and Training Page</title></head><body><h1>PLP Education and Training Page</h1><span class="govuk-visually-hidden" id="pageId" data-qa="plp-education-and-training-page"></span></body></html>',
    },
  })

const stubPlpWorkAndInterestsPageUi = (id = 'A3260DZ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/plan/${id}/view/work-and-interests`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html lang="en"><head><title>Mock PLP UI - Work and Interests Page</title></head><body><h1>PLP Work and Interests Page</h1><span class="govuk-visually-hidden" id="pageId" data-qa="plp-work-and-interests-page"></span></body></html>',
    },
  })

export default { stubPlpPrisonListPageUi, stubPlpEducationAndTrainingPageUi, stubPlpWorkAndInterestsPageUi }
