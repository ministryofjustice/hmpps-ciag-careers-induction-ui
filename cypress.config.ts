import * as fs from 'fs'
import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import nomisUserRolesApi from './integration_tests/mockApis/nomisUserRolesApi'
import prisonerSearchApi from './integration_tests/mockApis/prisonerSearchApi'
import curiousApi from './integration_tests/mockApis/curiousApi'
import ciagApi from './integration_tests/mockApis/ciagApi'
import frontendComponentApi from './integration_tests/mockApis/frontendComponentApi'
import plpUi from './integration_tests/mockApis/plpUi'
import educationAndWorkPlanApi from './integration_tests/mockApis/educationAndWorkPlanApi'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  video: true,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,
        ...auth,
        ...manageUsersApi,
        ...tokenVerification,
        ...nomisUserRolesApi,
        ...prisonerSearchApi,
        ...curiousApi,
        ...ciagApi,
        ...educationAndWorkPlanApi,
        ...frontendComponentApi,
        ...plpUi,
      })
      on('after:spec', (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some(test => test.attempts.some(attempt => attempt.state === 'failed'))
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })
    },
    experimentalInteractiveRunEvents: true,
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
