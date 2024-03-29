import EducationLevelPage from '../pages/educationLevel'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import QualificationDetailsPage from '../pages/qualificationDetails'
import QualificationLevelPage from '../pages/qualificationLevel'
import QualificationsPage from '../pages/qualifications'

context('Qualification details page', () => {
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
    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_TOOK_EXAMS').click()
    educationLevelPage.submitButton().click()

    const qualificationLevelPage = new QualificationLevelPage(
      'What level of secondary school qualification does Daniel Craig want to add?',
    )
    qualificationLevelPage.radioFieldValue('LEVEL_1').click()
    qualificationLevelPage.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const qualificationDetailsPage = new QualificationDetailsPage('Add a level 1 qualification')

    qualificationDetailsPage.submitButton().click()

    qualificationDetailsPage
      .subjectPageErrorMessage()
      .contains("Enter the subject of Daniel Craig's level 1 qualification")
    qualificationDetailsPage
      .subjectFieldErrorMessage()
      .contains("Enter the subject of Daniel Craig's level 1 qualification")
    qualificationDetailsPage.gradePageErrorMessage().contains("Enter the grade of Daniel Craig's level 1 qualification")
    qualificationDetailsPage
      .gradeFieldErrorMessage()
      .contains("Enter the grade of Daniel Craig's level 1 qualification")

    qualificationDetailsPage.subjectField().type(longStr)
    qualificationDetailsPage.gradeField().type(longStr)
    qualificationDetailsPage.submitButton().click()

    qualificationDetailsPage.subjectPageErrorMessage().contains('Subject must be 200 characters or less')
    qualificationDetailsPage.subjectPageErrorMessage().contains('Subject must be 200 characters or less')

    qualificationDetailsPage.gradePageErrorMessage().contains('Grade must be 200 characters or less')
    qualificationDetailsPage.gradePageErrorMessage().contains('Grade must be 200 characters or less')
  })

  it('New record - Select NOT_SURE - Continue navigates to qualification details page', () => {
    const qualificationDetailsPage = new QualificationDetailsPage('Add a level 1 qualification')

    qualificationDetailsPage.subjectField().type('Mathematics')
    qualificationDetailsPage.gradeField().type('A')

    qualificationDetailsPage.submitButton().click()

    cy.url().should('include', 'qualifications-list/new')
  })
})
