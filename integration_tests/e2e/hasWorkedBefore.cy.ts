import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import OtherQualificationsPage from '../pages/otherQualifications'
import QualificationsPage from '../pages/qualifications'

context('Has worked before page', () => {
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

    const otherQualifications = new OtherQualificationsPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    otherQualifications.checkboxFieldValue('DRIVING_LICENSE').click()
    otherQualifications.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')

    hasWorkedBefore.submitButton().click()

    hasWorkedBefore.pageErrorMessage().contains('Select whether Daniel Craig has worked before or not')
    hasWorkedBefore.fieldErrorMessage().contains('Select whether Daniel Craig has worked before or not')

    hasWorkedBefore.submitButton().click()
  })

  it('New record - Select YES - navigates to type-of-work page', () => {
    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')

    hasWorkedBefore.radioFieldValue('YES').click()
    hasWorkedBefore.submitButton().click()

    cy.url().should('include', 'type-of-work')
  })

  it('New record - Select NO - navigates to work-interests page', () => {
    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')

    hasWorkedBefore.radioFieldValue('NO').click()
    hasWorkedBefore.submitButton().click()

    cy.url().should('include', 'work-interests')
  })
})
