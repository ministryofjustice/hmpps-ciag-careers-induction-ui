[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-ciag-careers-induction-ui/tree/main.svg?style=svg)](https://app.circleci.com/pipelines/github/ministryofjustice/hmpps-ciag-careers-induction-ui?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/ministryofjustice/hmpps-ciag-careers-induction-ui/badge.svg)](https://snyk.io/test/github/ministryofjustice/hmpps-ciag-careers-induction-ui)
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-ciag-careers-induction-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-report/hmpps-ciag-careers-induction-ui "Link to report")

[![JS](https://img.shields.io/badge/JavaScript-323330?style=flat&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=fff)](http://www.typescriptlang.org/)
[![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=Node.js&logoColor=fff)](https://nodejs.org/en/)
[![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/-Jest-C21325?style=postgres&logo=Jest&logoColor=fff)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=ESLint&logoColor=fff)](https://eslint.org/)

[![Docker](https://img.shields.io/badge/-Docker-000?logo=docker)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=flat&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=postgres&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=flat&logo=redis&logoColor=white)](https://redis.io/)

# HMPPS Ciag careers induction

This is a front-end application used by staff in HMPPS to record someone’s education, skills and work experience; create goals for their time in prison and future employment.

It is a nodeJS application which by default starts up and listens on URL http://localhost:3000


# Running locally

The UI application needs a suite of services to work:

|         Dependency          | Description                                                                                | Default                    | Override Env Var             |
|:---------------------------:|:-------------------------------------------------------------------------------------------|:---------------------------|:-----------------------------|
|         hmpps-auth          | OAuth2 API server for authenticating requests                                              | http://localhost:9090/auth | HMPPS_AUTH_URL               |
| education-and-work-plan-api | API to access offender profile details                                                     | http://localhost:8083      | EDUCATION_AND_WORK_PLAN_API  |
|       offender-search       | OpenSearch API to find probation offenders                                                 | No default                 | PRISONER_SEARCH_URL          |
|          postgres           | PostgreSQL database server for storing profiles                                            | psql://localhost:5432      | None - required locally      |
|            redis            | Redis cache for user 'session' data (roles)                                                | localhost:6379/tcp         | None - required locally      |
|    nomis-user-roles-api     | Authenticate and retrieve user name & email                                                | http://localhost:8097      | NOMIS_USER_ROLES_API_URL     |
|         curiousApi          | Offenders employment, skills and neurodivergence data (3rd party API managed by MegaNexus) | http://localhost:8083      | CURIOUS_API_URL              |

More information about the template project including features can be
found [here](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/3488677932/Typescript+template+project).

## User Roles
Once the UI is running users will need to authenticate with `hmpps-auth` using a valid DPS username. The DPS user needs to have the followings roles
dependent on the access/functionality required:

* `ROLE_EDUCATION_WORK_PLAN_VIEWER` - required to be able to perform read only actions
* `ROLE_EDUCATION_WORK_PLAN_EDITOR` - required to be able to perform actions that edit/create data

## Running the app for development
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull` (as and when required)

`docker-compose up --scale=app=0`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching


Install dependencies using `npm install`, ensuring you are using `node v18.x` and `npm v9.x`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`


### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`


## Feature Toggles
Features can be toggled by setting the relevant environment variable.

| Name                | Default Value | Type    | Description                                              |
|---------------------|---------------|---------|----------------------------------------------------------|
| SOME_TOGGLE_ENABLED | false         | Boolean | Example feature toggle, for demonstration purposes.      |
