import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import AdditionalTrainingPage from '../pages/additionalTraining'
import ParticularJobInterestsPage from '../pages/particularJobInterests'
import QualificationsPage from '../pages/qualifications'
import SkillsPage from '../pages/skills'
import WorkInterestsPage from '../pages/workInterests'

context('Skills page', () => {
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
    workInterestsPage.submitButton().click()

    const particularJobInterestsPage = new ParticularJobInterestsPage(
      'Is Daniel Craig interested in any particular jobs?',
    )

    particularJobInterestsPage.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const skillsPage = new SkillsPage('What skills does Daniel Craig feel they have?')

    skillsPage.submitButton().click()

    skillsPage
      .checkboxPageErrorMessage()
      .contains("Select the skill that Daniel Craig feels they have or select 'None of these'")
    skillsPage
      .checkboxFieldErrorMessage()
      .contains("Select the skill that Daniel Craig feels they have or select 'None of these'")

    skillsPage.checkboxFieldValue('OTHER').click()
    skillsPage.submitButton().click()

    skillsPage.detailsPageErrorMessage().contains('Enter the skill that Daniel Craig feels they have')
    skillsPage.detailsFieldErrorMessage().contains('Enter the skill that Daniel Craig feels they have')

    skillsPage.textareaField().type(longStr)
    skillsPage.submitButton().click()

    skillsPage.detailsPageErrorMessage().contains('Skill must be 200 characters or less')
    skillsPage.detailsFieldErrorMessage().contains('Skill must be 200 characters or less')
  })

  it('New record - Select COMMUNICATION - navigates to interests page', () => {
    const skillsPage = new SkillsPage('What skills does Daniel Craig feel they have?')

    skillsPage.checkboxFieldValue('COMMUNICATION').click()

    skillsPage.submitButton().click()

    cy.url().should('include', 'personal-interests')
  })

  it('New record - Select OTHER - navigates to interests page', () => {
    const skillsPage = new SkillsPage('What skills does Daniel Craig feel they have?')

    skillsPage.checkboxFieldValue('OTHER').click()
    skillsPage.textareaField().type('Some other skill')

    skillsPage.submitButton().click()

    cy.url().should('include', 'personal-interests')
  })
})
