import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import JobDetailsPage from '../pages/jobDetails'
import AdditionalTrainingPage from '../pages/additionalTraining'
import QualificationsPage from '../pages/qualifications'
import TypeOfWorkExperiencePage from '../pages/typeOfWorkExperience'

context('Job details page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlanList')
    cy.task('getCiagPlan')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.task('getPrisonersByCaseloadId', 'MDI')
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work/new')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")
    hopingToGetWorkPage.radioFieldValue('YES').click()
    hopingToGetWorkPage.submitButton().click()

    const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
    qualificationsPage.submitButton().click()

    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )
    educationLevelPage.radioFieldValue('PRIMARY_SCHOOL').click()
    educationLevelPage.submitButton().click()

    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()
    additionalTraining.submitButton().click()

    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')

    hasWorkedBefore.radioFieldValue('YES').click()
    hasWorkedBefore.submitButton().click()

    const typeOfWorkExperiencePage = new TypeOfWorkExperiencePage('What type of work has Daniel Craig done before?')

    typeOfWorkExperiencePage.checkboxFieldValue('HOSPITALITY').click()
    typeOfWorkExperiencePage.checkboxFieldValue('OTHER').click()
    typeOfWorkExperiencePage.textareaField().type('Some other job')

    typeOfWorkExperiencePage.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const jobDetailsPage = new JobDetailsPage('What did Daniel Craig do in their Hospitality and catering job?')
    jobDetailsPage.submitButton().click()

    jobDetailsPage.roleFieldErrorMessage().contains('Enter the job role Daniel Craig wants to add')
    jobDetailsPage.rolePageErrorMessage().contains('Enter the job role Daniel Craig wants to add')

    jobDetailsPage.detailsPageErrorMessage().contains('Enter details of what Daniel Craig did in their job')
    jobDetailsPage.detailsFieldErrorMessage().contains('Enter details of what Daniel Craig did in their job')
  })

  it('New record - Navigates through each job - navigates to work-interests page', () => {
    let jobDetailsPage = new JobDetailsPage('What did Daniel Craig do in their Hospitality and catering job?')
    jobDetailsPage.roleField().type('Mock Role')
    jobDetailsPage.detailsField().type('Mock Details')

    jobDetailsPage.submitButton().click()

    jobDetailsPage = new JobDetailsPage('What did Daniel Craig do in their Other job?')

    jobDetailsPage.roleField().type('Mock Role')
    jobDetailsPage.detailsField().type('Mock Details')

    jobDetailsPage.submitButton().click()

    cy.url().should('include', 'work-interests')
  })
})
