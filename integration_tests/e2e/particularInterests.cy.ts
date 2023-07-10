import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import OtherQualificationsPage from '../pages/otherQualifications'
import ParticularInterestsPage from '../pages/particularInterests'
import QualificationsPage from '../pages/qualifications'
import WorkInterestsPage from '../pages/workInterests'

context('Particular interests page', () => {
  const longStr = 'x'.repeat(201)

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
    const particularInterestsPage = new ParticularInterestsPage('Is Daniel Craig interested in any particular jobs?')

    particularInterestsPage.textField('HOSPITALITY').type(longStr)
    particularInterestsPage.textField('OTHER').type(longStr)
    particularInterestsPage.textField('OUTDOOR').type(longStr)
    particularInterestsPage.textField('CONSTRUCTION').type(longStr)
    particularInterestsPage.textField('DRIVING').type(longStr)
    particularInterestsPage.textField('BEAUTY').type(longStr)
    particularInterestsPage.textField('TECHNICAL').type(longStr)
    particularInterestsPage.textField('MANUFACTURING').type(longStr)
    particularInterestsPage.textField('OFFICE').type(longStr)
    particularInterestsPage.textField('RETAIL').type(longStr)
    particularInterestsPage.textField('SPORTS').type(longStr)
    particularInterestsPage.textField('WAREHOUSING').type(longStr)
    particularInterestsPage.textField('EDUCATION_TRAINING').type(longStr)
    particularInterestsPage.textField('WASTE_MANAGEMENT').type(longStr)

    particularInterestsPage.submitButton().click()

    particularInterestsPage
      .textPageErrorMessage('OUTDOOR')
      .contains('Animal care and farming job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('OUTDOOR')
      .contains('Animal care and farming job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('CONSTRUCTION')
      .contains('Construction and trade job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('CONSTRUCTION')
      .contains('Construction and trade job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('DRIVING')
      .contains('Driving and transport job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('DRIVING')
      .contains('Driving and transport job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('BEAUTY')
      .contains('Hair, beauty and wellbeing job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('BEAUTY')
      .contains('Hair, beauty and wellbeing job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('TECHNICAL')
      .contains('IT and digital job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('TECHNICAL')
      .contains('IT and digital job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('MANUFACTURING')
      .contains('Manufacturing and technical job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('MANUFACTURING')
      .contains('Manufacturing and technical job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('OFFICE')
      .contains('Office or desk-based job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('OFFICE')
      .contains('Office or desk-based job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('RETAIL')
      .contains('Retail and sales job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('RETAIL')
      .contains('Retail and sales job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('SPORTS')
      .contains('Sport and fitness job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('SPORTS')
      .contains('Sport and fitness job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('WAREHOUSING')
      .contains('Warehousing and storage job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('WAREHOUSING')
      .contains('Warehousing and storage job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('EDUCATION_TRAINING')
      .contains('Training and support job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('EDUCATION_TRAINING')
      .contains('Training and support job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('WASTE_MANAGEMENT')
      .contains('Waste management job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('WASTE_MANAGEMENT')
      .contains('Waste management job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('HOSPITALITY')
      .contains('Hospitality and catering job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('HOSPITALITY')
      .contains('Hospitality and catering job role must be 200 characters or less')

    particularInterestsPage
      .textPageErrorMessage('OTHER')
      .contains('Some other role job role must be 200 characters or less')
    particularInterestsPage
      .textFieldErrorMessage('OTHER')
      .contains('Some other role job role must be 200 characters or less')
  })

  it('New record - No values (optional) - navigates to skills page', () => {
    const particularInterestsPage = new ParticularInterestsPage('Is Daniel Craig interested in any particular jobs?')

    particularInterestsPage.submitButton().click()

    cy.url().should('include', 'skills')
  })

  it('New record - All valid values - navigates to skills page', () => {
    const particularInterestsPage = new ParticularInterestsPage('Is Daniel Craig interested in any particular jobs?')

    particularInterestsPage.textField('HOSPITALITY').type('A valid value')
    particularInterestsPage.textField('OTHER').type('A valid value')
    particularInterestsPage.textField('OUTDOOR').type('A valid value')
    particularInterestsPage.textField('CONSTRUCTION').type('A valid value')
    particularInterestsPage.textField('DRIVING').type('A valid value')
    particularInterestsPage.textField('BEAUTY').type('A valid value')
    particularInterestsPage.textField('TECHNICAL').type('A valid value')
    particularInterestsPage.textField('MANUFACTURING').type('A valid value')
    particularInterestsPage.textField('OFFICE').type('A valid value')
    particularInterestsPage.textField('RETAIL').type('A valid value')
    particularInterestsPage.textField('SPORTS').type('A valid value')
    particularInterestsPage.textField('WAREHOUSING').type('A valid value')
    particularInterestsPage.textField('EDUCATION_TRAINING').type('A valid value')
    particularInterestsPage.textField('WASTE_MANAGEMENT').type('A valid value')

    particularInterestsPage.submitButton().click()

    cy.url().should('include', 'skills')
  })
})
