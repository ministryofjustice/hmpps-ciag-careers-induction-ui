import EducationLevelPage from '../pages/educationLevel'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import QualificationsPage from '../pages/qualifications'

context('Education level page', () => {
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
  })

  it('Validation messages display when no value selected', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.submitButton().click()

    educationLevelPage.pageErrorMessage().contains("Select Daniel Craig's highest level of education")
    educationLevelPage.fieldErrorMessage().contains("Select Daniel Craig's highest level of education")
  })

  it('New record - Select NOT_SURE - Continue navigates to other qualifications page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.radioFieldValue('NOT_SURE').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', 'additional-training/new')
  })

  it('New record - Select PRIMARY_SCHOOL - Continue navigates to other qualifications page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.radioFieldValue('PRIMARY_SCHOOL').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', 'additional-training/new')
  })

  it('New record - Select SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS - Continue navigates to other qualifications page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', 'additional-training/new')
  })

  it('New record - Select SECONDARY_SCHOOL_TOOK_EXAMS - Continue navigates to qualification level page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_TOOK_EXAMS').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-level')
  })

  it('New record - Select FURTHER_EDUCATION_COLLEGE - Continue navigates to qualification level page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.radioFieldValue('FURTHER_EDUCATION_COLLEGE').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-level')
  })

  it('New record - Select UNDERGRADUATE_DEGREE_AT_UNIVERSITY - Continue navigates to qualification details page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.radioFieldValue('UNDERGRADUATE_DEGREE_AT_UNIVERSITY').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-details')
  })

  it('New record - Select POSTGRADUATE_DEGREE_AT_UNIVERSITY - Continue navigates to qualification details page', () => {
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig completed before entering prison?",
    )

    educationLevelPage.radioFieldValue('POSTGRADUATE_DEGREE_AT_UNIVERSITY').click()

    educationLevelPage.submitButton().click()

    cy.url().should('include', '/qualification-details')
  })
})
