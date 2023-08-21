import HopingToGetWorkPage from '../pages/hopingToGetWork'
import NotHopingToGetWorkPage from '../pages/notHopingToGetWork'
import FunctionalSkillsPage from '../pages/functionalSkills'
import OtherQualificationsPage from '../pages/otherQualifications'
import EducationLevelPage from '../pages/educationLevel'

const pageTitle = "Why is Daniel Craig not hoping to get work when they're released?"

context('Not hoping to get work page', () => {
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
  })

  it('Validation messages display when no value selected', () => {
    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work/new')

    const notHopingToGetWorkPage = new NotHopingToGetWorkPage(
      `Why is Daniel Craig not hoping to get work when they're released?`,
    )

    notHopingToGetWorkPage.submitButton().click()

    notHopingToGetWorkPage.pageErrorMessage().contains('Select why Daniel Craig is not hoping to get work')
  })

  it('Select OTHER - no details given, display appropriate message', () => {
    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work/new')

    const notHopingToGetWorkPage = new NotHopingToGetWorkPage(pageTitle)

    notHopingToGetWorkPage.checkboxFieldValue('OTHER').click()
    notHopingToGetWorkPage.textareaField().clear()
    notHopingToGetWorkPage.submitButton().click()

    notHopingToGetWorkPage
      .detailsFieldErrorMessage()
      .should('contain', 'Enter why Daniel Craig is not hoping to get work when they’re released')
  })

  it('Select OTHER - details entered - navigate to qualifications page', () => {
    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work/new')

    const notHopingToGetWorkPage = new NotHopingToGetWorkPage(pageTitle)

    notHopingToGetWorkPage.checkboxFieldValue('OTHER').click()
    notHopingToGetWorkPage.textareaField().clear().type('other details')
    notHopingToGetWorkPage.submitButton().click()

    cy.visit('/plan/create/G6115VJ/qualifications-list/new')
  })

  it('Select OTHER - enter text with more characters than allowed', () => {
    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work/new')

    const notHopingToGetWorkPage = new NotHopingToGetWorkPage(pageTitle)

    const longStr = 'x'.repeat(201)

    notHopingToGetWorkPage.checkboxFieldValue('OTHER').click()
    notHopingToGetWorkPage.textareaField().clear().type(longStr)
    notHopingToGetWorkPage.submitButton().click()

    notHopingToGetWorkPage.detailsFieldErrorMessage().should('contain', 'Reason must be 200 characters or less')
  })

  it('Select reason(s) - select YES to enter educational qualifications', () => {
    cy.visit('/plan/create/G6115VJ/hoping-to-get-work')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('NO').click()
    hopingToGetWorkPage.submitButton().click()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work/new')

    const notHopingToGetWorkPage = new NotHopingToGetWorkPage(pageTitle)

    notHopingToGetWorkPage.checkboxFieldValue('RETIRED').click()
    notHopingToGetWorkPage.submitButton().click()

    cy.visit('/plan/create/G6115VJ/functional-skills/new')
    const functionalSkillsPage = new FunctionalSkillsPage("Daniel Craig's qualifications")
    functionalSkillsPage.radioFieldValue('YES').click()
    functionalSkillsPage.submitButton().click()

    const educationalLevel = new EducationLevelPage('What level of qualification does Daniel Craig want to add?')
    educationalLevel.radioFieldValue('LEVEL_1').click()
  })

  it('Select reason(s) - select NO to enter any training or vocational qualifications', () => {
    cy.visit('/plan/create/G6115VJ/hoping-to-get-work')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('NO').click()
    hopingToGetWorkPage.submitButton().click()

    cy.visit('/plan/create/G6115VJ/not-hoping-to-get-work/new')

    const notHopingToGetWorkPage = new NotHopingToGetWorkPage(pageTitle)

    notHopingToGetWorkPage.checkboxFieldValue('RETIRED').click()
    notHopingToGetWorkPage.submitButton().click()

    cy.visit('/plan/create/G6115VJ/functional-skills/new')
    const functionalSkillsPage = new FunctionalSkillsPage("Daniel Craig's qualifications")
    functionalSkillsPage.radioFieldValue('NO').click()
    functionalSkillsPage.submitButton().click()

    const otherQualifications = new OtherQualificationsPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    otherQualifications.checkboxFieldValue('NONE').click()
  })
})
