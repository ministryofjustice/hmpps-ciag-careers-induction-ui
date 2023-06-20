import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import OtherQualificationsPage from '../pages/otherQualifications'
import QualificationsPage from '../pages/qualifications'
import TypeOfWorkPage from '../pages/typeOfWork'

context('Type of work page', () => {
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

    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')

    hasWorkedBefore.radioFieldValue('YES').click()
    hasWorkedBefore.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const typeOfWorkPage = new TypeOfWorkPage('What type of work has Daniel Craig done before?')

    typeOfWorkPage.submitButton().click()

    typeOfWorkPage.checkboxPageErrorMessage().contains('Select the type of work Daniel Craig has done before')
    typeOfWorkPage.checkboxFieldErrorMessage().contains('Select the type of work Daniel Craig has done before')

    typeOfWorkPage.checkboxFieldValue('OTHER').click()
    typeOfWorkPage.submitButton().click()

    typeOfWorkPage.detailsPageErrorMessage().contains('Enter the type of work Daniel Craig has done before')
    typeOfWorkPage.detailsFieldErrorMessage().contains('Enter the type of work Daniel Craig has done before')
  })

  it('New record - Select HOSPITALITY - navigates to work-details page', () => {
    const typeOfWorkPage = new TypeOfWorkPage('What type of work has Daniel Craig done before?')

    typeOfWorkPage.checkboxFieldValue('HOSPITALITY').click()

    typeOfWorkPage.submitButton().click()

    cy.url().should('include', 'work-details/hospitality')
  })

  it('New record - Select OTHER - navigates to work-details page', () => {
    const typeOfWorkPage = new TypeOfWorkPage('What type of work has Daniel Craig done before?')

    typeOfWorkPage.checkboxFieldValue('OTHER').click()
    typeOfWorkPage.textareaField().type('Some other job')

    typeOfWorkPage.submitButton().click()

    cy.url().should('include', 'work-details/other')
  })
})
