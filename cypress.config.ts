import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import nomisUserRolesApi from './integration_tests/mockApis/nomisUserRolesApi'
import prisonerSearchApi from './integration_tests/mockApis/prisonerSearchApi'
import curiousApi from './integration_tests/mockApis/curiousApi'
import ciagApi from './integration_tests/mockApis/ciagApi'
import educationAndWorkPlanApi from './integration_tests/mockApis/educationAndWorkPlanApi'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  videoUploadOnPasses: false,
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
      }),
        on('before:browser:launch', (browser = {} as any, launchOptions) => {
          if (browser.name === 'chrome') {
            launchOptions.args.push('--disable-site-isolation-trials')

            return launchOptions
          }
        })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
