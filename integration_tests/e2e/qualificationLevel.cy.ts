import EducationLevelPage from '../pages/educationLevel'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import QualificationLevelPage from '../pages/qualificationLevel'
import QualificationsPage from '../pages/qualifications'

context('Qualification level page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.task('getPrisonersByCaseloadId', 'MDI')
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")
    hopingToGetWorkPage.radioFieldValue('YES').click()
    hopingToGetWorkPage.submitButton().click()

    const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
    qualificationsPage.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_EXAMS').click()
    educationLevelPage.submitButton().click()

    const qualificationLevelPage = new QualificationLevelPage(
      'What level of secondary school qualification does Daniel Craig want to add?',
    )

    qualificationLevelPage.submitButton().click()

    qualificationLevelPage.pageErrorMessage().contains('Select the level of qualification Daniel Craig wants to add')
    qualificationLevelPage.fieldErrorMessage().contains('Select the level of qualification Daniel Craig wants to add')
  })

  it('New record - SECONDARY_SCHOOL_EXAMS - Select a value - Continue navigates to qualification details page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_EXAMS').click()
    educationLevelPage.submitButton().click()

    const qualificationLevelPage = new QualificationLevelPage(
      'What level of secondary school qualification does Daniel Craig want to add?',
    )

    qualificationLevelPage.radioFieldValue('LEVEL_1').click()

    qualificationLevelPage.submitButton().click()

    cy.url().should('include', 'qualification-details')
  })

  it('New record - FURTHER_EDUCATION_COLLEGE - Select a value - Continue navigates to qualification details page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('FURTHER_EDUCATION_COLLEGE').click()
    educationLevelPage.submitButton().click()

    const qualificationLevelPage = new QualificationLevelPage(
      'What level of further education college qualification does Daniel Craig want to add?',
    )

    qualificationLevelPage.radioFieldValue('LEVEL_5').click()

    qualificationLevelPage.submitButton().click()

    cy.url().should('include', 'qualification-details')
  })
})
