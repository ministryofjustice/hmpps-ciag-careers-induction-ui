import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import AdditionalTrainingPage from '../pages/additionalTraining'
import ParticularJobInterestsPage from '../pages/particularJobInterests'
import QualificationsPage from '../pages/qualifications'
import WorkInterestsPage from '../pages/workInterests'

context('Particular interests page', () => {
  const longStr = 'x'.repeat(201)

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

    const workInterestsPage = new WorkInterestsPage('What type of work is Daniel Craig interested in?')

    workInterestsPage.checkboxFieldValue('HOSPITALITY').click()
    workInterestsPage.checkboxFieldValue('OUTDOOR').click()
    workInterestsPage.checkboxFieldValue('CONSTRUCTION').click()
    workInterestsPage.checkboxFieldValue('DRIVING').click()
    workInterestsPage.checkboxFieldValue('BEAUTY').click()
    workInterestsPage.checkboxFieldValue('TECHNICAL').click()
    workInterestsPage.checkboxFieldValue('MANUFACTURING').click()
    workInterestsPage.checkboxFieldValue('OFFICE').click()
    workInterestsPage.checkboxFieldValue('RETAIL').click()
    workInterestsPage.checkboxFieldValue('SPORTS').click()
    workInterestsPage.checkboxFieldValue('WAREHOUSING').click()
    workInterestsPage.checkboxFieldValue('EDUCATION_TRAINING').click()
    workInterestsPage.checkboxFieldValue('WASTE_MANAGEMENT').click()
    workInterestsPage.checkboxFieldValue('OTHER').click()
    workInterestsPage.textareaField().type('Some other role')
    workInterestsPage.submitButton().click()
  })

  it('New record - Validation messages display when values are to long', () => {
    const particularJobInterestsPage = new ParticularJobInterestsPage(
      'Is Daniel Craig interested in any particular jobs?',
    )

    particularJobInterestsPage.textField('HOSPITALITY').type(longStr)
    particularJobInterestsPage.textField('OTHER').type(longStr)
    particularJobInterestsPage.textField('OUTDOOR').type(longStr)
    particularJobInterestsPage.textField('CONSTRUCTION').type(longStr)
    particularJobInterestsPage.textField('DRIVING').type(longStr)
    particularJobInterestsPage.textField('BEAUTY').type(longStr)
    particularJobInterestsPage.textField('TECHNICAL').type(longStr)
    particularJobInterestsPage.textField('MANUFACTURING').type(longStr)
    particularJobInterestsPage.textField('OFFICE').type(longStr)
    particularJobInterestsPage.textField('RETAIL').type(longStr)
    particularJobInterestsPage.textField('SPORTS').type(longStr)
    particularJobInterestsPage.textField('WAREHOUSING').type(longStr)
    particularJobInterestsPage.textField('EDUCATION_TRAINING').type(longStr)
    particularJobInterestsPage.textField('WASTE_MANAGEMENT').type(longStr)

    particularJobInterestsPage.submitButton().click()

    particularJobInterestsPage
      .textPageErrorMessage('OUTDOOR')
      .contains('Animal care and farming job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('OUTDOOR')
      .contains('Animal care and farming job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('CONSTRUCTION')
      .contains('Construction and trade job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('CONSTRUCTION')
      .contains('Construction and trade job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('DRIVING')
      .contains('Driving and transport job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('DRIVING')
      .contains('Driving and transport job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('BEAUTY')
      .contains('Hair, beauty and wellbeing job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('BEAUTY')
      .contains('Hair, beauty and wellbeing job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('TECHNICAL')
      .contains('IT and digital job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('TECHNICAL')
      .contains('IT and digital job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('MANUFACTURING')
      .contains('Manufacturing and technical job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('MANUFACTURING')
      .contains('Manufacturing and technical job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('OFFICE')
      .contains('Office or desk-based job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('OFFICE')
      .contains('Office or desk-based job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('RETAIL')
      .contains('Retail and sales job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('RETAIL')
      .contains('Retail and sales job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('SPORTS')
      .contains('Sport and fitness job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('SPORTS')
      .contains('Sport and fitness job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('WAREHOUSING')
      .contains('Warehousing and storage job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('WAREHOUSING')
      .contains('Warehousing and storage job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('EDUCATION_TRAINING')
      .contains('Training and support job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('EDUCATION_TRAINING')
      .contains('Training and support job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('WASTE_MANAGEMENT')
      .contains('Waste management job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('WASTE_MANAGEMENT')
      .contains('Waste management job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('HOSPITALITY')
      .contains('Hospitality and catering job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('HOSPITALITY')
      .contains('Hospitality and catering job role must be 200 characters or less')

    particularJobInterestsPage
      .textPageErrorMessage('OTHER')
      .contains('Some other role job role must be 200 characters or less')
    particularJobInterestsPage
      .textFieldErrorMessage('OTHER')
      .contains('Some other role job role must be 200 characters or less')
  })

  it('New record - No values (optional) - navigates to skills page', () => {
    const particularJobInterestsPage = new ParticularJobInterestsPage(
      'Is Daniel Craig interested in any particular jobs?',
    )

    particularJobInterestsPage.submitButton().click()

    cy.url().should('include', 'skills')
  })

  it('New record - All valid values - navigates to skills page', () => {
    const particularJobInterestsPage = new ParticularJobInterestsPage(
      'Is Daniel Craig interested in any particular jobs?',
    )

    particularJobInterestsPage.textField('HOSPITALITY').type('A valid value')
    particularJobInterestsPage.textField('OTHER').type('A valid value')
    particularJobInterestsPage.textField('OUTDOOR').type('A valid value')
    particularJobInterestsPage.textField('CONSTRUCTION').type('A valid value')
    particularJobInterestsPage.textField('DRIVING').type('A valid value')
    particularJobInterestsPage.textField('BEAUTY').type('A valid value')
    particularJobInterestsPage.textField('TECHNICAL').type('A valid value')
    particularJobInterestsPage.textField('MANUFACTURING').type('A valid value')
    particularJobInterestsPage.textField('OFFICE').type('A valid value')
    particularJobInterestsPage.textField('RETAIL').type('A valid value')
    particularJobInterestsPage.textField('SPORTS').type('A valid value')
    particularJobInterestsPage.textField('WAREHOUSING').type('A valid value')
    particularJobInterestsPage.textField('EDUCATION_TRAINING').type('A valid value')
    particularJobInterestsPage.textField('WASTE_MANAGEMENT').type('A valid value')

    particularJobInterestsPage.submitButton().click()

    cy.url().should('include', 'skills')
  })
})
