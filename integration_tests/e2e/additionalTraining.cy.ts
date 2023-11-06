import EducationLevelPage from '../pages/educationLevel'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import AdditionalTrainingPage from '../pages/additionalTraining'
import QualificationsPage from '../pages/qualifications'

context('Other qualifications level page', () => {
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
      'What’s the highest level of education Daniel Craig completed before entering prison?',
    )

    educationLevelPage.radioFieldValue('PRIMARY_SCHOOL').click()
    educationLevelPage.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )

    additionalTraining.submitButton().click()

    additionalTraining
      .checkboxPageErrorMessage()
      .contains('Select the type of training or vocational qualification Daniel Craig has')
    additionalTraining
      .checkboxFieldErrorMessage()
      .contains('Select the type of training or vocational qualification Daniel Craig has')

    additionalTraining.checkboxFieldValue('OTHER').click()
    additionalTraining.submitButton().click()

    additionalTraining
      .detailsPageErrorMessage()
      .contains('Enter the type of training or vocational qualification Daniel Craig has')
    additionalTraining
      .detailsFieldErrorMessage()
      .contains('Enter the type of training or vocational qualification Daniel Craig has')
  })

  it('New record - Select FULL_UK_DRIVING_LICENCE and OTHER - navigates to has-worked-before page', () => {
    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )

    additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()
    additionalTraining.checkboxFieldValue('OTHER').click()
    additionalTraining.textareaField().type('Some other qualifications')

    additionalTraining.submitButton().click()

    cy.url().should('include', 'has-worked-before')
  })
})
