import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import AdditionalTrainingPage from '../pages/additionalTraining'
import QualificationsPage from '../pages/qualifications'
import TypeOfWorkExperiencePage from '../pages/typeOfWorkExperience'

context('Type of work page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlanList')
    cy.task('getCiagPlanList')
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
  })

  it('New record - Validation messages display when no value selected', () => {
    const typeOfWorkExperiencePage = new TypeOfWorkExperiencePage('What type of work has Daniel Craig done before?')

    typeOfWorkExperiencePage.submitButton().click()

    typeOfWorkExperiencePage.checkboxPageErrorMessage().contains('Select the type of work Daniel Craig has done before')
    typeOfWorkExperiencePage
      .checkboxFieldErrorMessage()
      .contains('Select the type of work Daniel Craig has done before')

    typeOfWorkExperiencePage.checkboxFieldValue('OTHER').click()
    typeOfWorkExperiencePage.submitButton().click()

    typeOfWorkExperiencePage.detailsPageErrorMessage().contains('Enter the type of work Daniel Craig has done before')
    typeOfWorkExperiencePage.detailsFieldErrorMessage().contains('Enter the type of work Daniel Craig has done before')
  })

  it('New record - Select HOSPITALITY - navigates to work-details page', () => {
    const typeOfWorkExperiencePage = new TypeOfWorkExperiencePage('What type of work has Daniel Craig done before?')

    typeOfWorkExperiencePage.checkboxFieldValue('HOSPITALITY').click()

    typeOfWorkExperiencePage.submitButton().click()

    cy.url().should('include', 'work-details/hospitality')
  })

  it('New record - Select OTHER - navigates to work-details page', () => {
    const typeOfWorkExperiencePage = new TypeOfWorkExperiencePage('What type of work has Daniel Craig done before?')

    typeOfWorkExperiencePage.checkboxFieldValue('OTHER').click()
    typeOfWorkExperiencePage.textareaField().type('Some other job')

    typeOfWorkExperiencePage.submitButton().click()

    cy.url().should('include', 'work-details/other')
  })
})
