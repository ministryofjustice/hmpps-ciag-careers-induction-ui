import EducationLevelPage from '../pages/educationLevel'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import QualificationsPage from '../pages/qualifications'

context('Education level page', () => {
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
  })

  it('Validation messages display when no value selected', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.submitButton().click()

    educationLevelPage.pageErrorMessage().contains("Select Daniel Craig's highest level of education")
    educationLevelPage.fieldErrorMessage().contains("Select Daniel Craig's highest level of education")
  })

  it('New record - Select NOT_SURE - Continue navigates to other qualifications page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('NOT_SURE').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', 'other-qualifications/new')
  })

  it('New record - Select PRIMARY_SCHOOL - Continue navigates to other qualifications page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('PRIMARY_SCHOOL').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', 'other-qualifications/new')
  })

  it('New record - Select SECONDARY_SCHOOL_NO_EXAMS - Continue navigates to other qualifications page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_NO_EXAMS').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', 'other-qualifications/new')
  })

  it('New record - Select SECONDARY_SCHOOL_EXAMS - Continue navigates to qualification level page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_EXAMS').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-level/1/new')
  })

  it('New record - Select FURTHER_EDUCATION_COLLEGE - Continue navigates to qualification level page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('FURTHER_EDUCATION_COLLEGE').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-level/1/new')
  })

  it('New record - Select UNDERGRADUATE_DEGREE - Continue navigates to qualification details page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('UNDERGRADUATE_DEGREE').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-details/1/new')
  })

  it('New record - Select POSTGRADUATE_DEGREE - Continue navigates to qualification details page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )

    educationLevelPage.radioFieldValue('POSTGRADUATE_DEGREE').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-details/1/new')
  })
})
