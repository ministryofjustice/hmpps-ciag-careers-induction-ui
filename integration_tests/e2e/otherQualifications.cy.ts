import EducationLevelPage from '../pages/educationLevel'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import OtherQualificationsPage from '../pages/otherQualifications'
import QualificationLevelPage from '../pages/qualificationLevel'
import QualificationsPage from '../pages/qualifications'

context('Other qualifications level page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work')

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
  })

  it('New record - Validation messages display when no value selected', () => {
    const otherQualifications = new OtherQualificationsPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )

    otherQualifications.submitButton().click()

    otherQualifications
      .checkboxPageErrorMessage()
      .contains('Select the type of training or vocational qualification Daniel Craig has')
    otherQualifications
      .checkboxFieldErrorMessage()
      .contains('Select the type of training or vocational qualification Daniel Craig has')

    otherQualifications.checkboxFieldValue('OTHER').click()
    otherQualifications.submitButton().click()

    otherQualifications
      .detailsPageErrorMessage()
      .contains('Enter the type of training or vocational qualification Daniel Craig has')
    otherQualifications
      .detailsFieldErrorMessage()
      .contains('Enter the type of training or vocational qualification Daniel Craig has')
  })

  it('New record - Select DRIVING_LICENSE and OTHER - navigates to has-worked-before page', () => {
    const otherQualifications = new OtherQualificationsPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )

    otherQualifications.checkboxFieldValue('DRIVING_LICENSE').click()
    otherQualifications.checkboxFieldValue('OTHER').click()
    otherQualifications.textareaField().type('Some other qualifications')

    otherQualifications.submitButton().click()

    cy.url().should('include', 'has-worked-before')
  })
})
