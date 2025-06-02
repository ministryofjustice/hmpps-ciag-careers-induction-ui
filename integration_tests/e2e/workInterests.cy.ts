import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import AdditionalTrainingPage from '../pages/additionalTraining'
import QualificationsPage from '../pages/qualifications'
import WorkInterestsPage from '../pages/workInterests'

context('Work interests page', () => {
  const longStr = 'x'.repeat(201)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubPlpPrisonListPageUi')
    cy.task('stubGetFrontEndComponents')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work/new')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")
    hopingToGetWorkPage.radioFieldValue('YES').click()
    hopingToGetWorkPage.submitButton().click()

    const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
    qualificationsPage.submitButton().click()

    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )
    educationLevelPage.radioFieldValue('PRIMARY_SCHOOL').click()
    educationLevelPage.submitButton().click()

    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()
    additionalTraining.submitButton().click()

    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')

    hasWorkedBefore.radioFieldValue('NO').click()
    hasWorkedBefore.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const workInterestsPage = new WorkInterestsPage('What type of work is Daniel Craig interested in?')

    workInterestsPage.submitButton().click()

    workInterestsPage.checkboxPageErrorMessage().contains('Select the type of work Daniel Craig is interested in')
    workInterestsPage.checkboxFieldErrorMessage().contains('Select the type of work Daniel Craig is interested in')

    workInterestsPage.checkboxFieldValue('OTHER').click()
    workInterestsPage.submitButton().click()

    workInterestsPage.detailsPageErrorMessage().contains('Enter the type of work Daniel Craig is interested in')
    workInterestsPage.detailsFieldErrorMessage().contains('Enter the type of work Daniel Craig is interested in')

    workInterestsPage.textareaField().type(longStr)
    workInterestsPage.submitButton().click()

    workInterestsPage.detailsPageErrorMessage().contains('Type of work interest must be 200 characters or less')
    workInterestsPage.detailsFieldErrorMessage().contains('Type of work interest must be 200 characters or less')
  })

  it('New record - Select HOSPITALITY - navigates to particular-job-interests page', () => {
    const workInterestsPage = new WorkInterestsPage('What type of work is Daniel Craig interested in?')

    workInterestsPage.checkboxFieldValue('HOSPITALITY').click()

    workInterestsPage.submitButton().click()

    cy.url().should('include', 'particular-job-interests')
  })

  it('New record - Select OTHER - navigates to particular-job-interests page', () => {
    const workInterestsPage = new WorkInterestsPage('What type of work is Daniel Craig interested in?')

    workInterestsPage.checkboxFieldValue('OTHER').click()
    workInterestsPage.textareaField().type('Some other job')

    workInterestsPage.submitButton().click()

    cy.url().should('include', 'particular-job-interests')
  })
})
