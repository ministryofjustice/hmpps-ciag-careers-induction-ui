import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import PersonalInterestsPage from '../pages/personalInterests'
import AdditionalTrainingPage from '../pages/additionalTraining'
import ParticularJobInterestsPage from '../pages/particularJobInterests'
import QualificationsPage from '../pages/qualifications'
import SkillsPage from '../pages/skills'
import WorkInterestsPage from '../pages/workInterests'

context('Personal Interests page', () => {
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

    const skillsPage = new SkillsPage('What skills does Daniel Craig feel they have?')

    skillsPage.checkboxFieldValue('COMMUNICATION').click()

    skillsPage.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const personalInterests = new PersonalInterestsPage("What are Daniel Craig's interests?")

    personalInterests.submitButton().click()

    personalInterests.checkboxPageErrorMessage().contains("Select Daniel Craig's interests or select 'None of these'")
    personalInterests.checkboxFieldErrorMessage().contains("Select Daniel Craig's interests or select 'None of these'")

    personalInterests.checkboxFieldValue('OTHER').click()
    personalInterests.submitButton().click()

    personalInterests.detailsPageErrorMessage().contains("Enter Daniel Craig's interests")
    personalInterests.detailsFieldErrorMessage().contains("Enter Daniel Craig's interests")

    personalInterests.textareaField().type(longStr)
    personalInterests.submitButton().click()

    personalInterests.detailsPageErrorMessage().contains('Interest must be 200 characters or less')
    personalInterests.detailsFieldErrorMessage().contains('Interest must be 200 characters or less')
  })

  it('New record - Select COMMUNITY - navigates to ability-to-work page', () => {
    const personalInterests = new PersonalInterestsPage("What are Daniel Craig's interests?")

    personalInterests.checkboxFieldValue('COMMUNITY').click()

    personalInterests.submitButton().click()

    cy.url().should('include', 'ability-to-work')
  })

  it('New record - Select OTHER - navigates to ability-to-work page', () => {
    const personalInterests = new PersonalInterestsPage("What are Daniel Craig's interests?")

    personalInterests.checkboxFieldValue('OTHER').click()
    personalInterests.textareaField().type('Some other interest')

    personalInterests.submitButton().click()

    cy.url().should('include', 'ability-to-work')
  })
})
