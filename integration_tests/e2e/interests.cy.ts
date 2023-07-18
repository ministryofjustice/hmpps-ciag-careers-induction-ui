import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import InterestsPage from '../pages/interests'
import OtherQualificationsPage from '../pages/otherQualifications'
import ParticularJobInterestsPage from '../pages/particularJobInterests'
import QualificationsPage from '../pages/qualifications'
import SkillsPage from '../pages/skills'
import WorkInterestsPage from '../pages/workInterests'

context('Work interests page', () => {
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
    const interestsPage = new InterestsPage("What are Daniel Craig's interests?")

    interestsPage.submitButton().click()

    interestsPage.checkboxPageErrorMessage().contains("Select Daniel Craig's interests or select 'None of these'")
    interestsPage.checkboxFieldErrorMessage().contains("Select Daniel Craig's interests or select 'None of these'")

    interestsPage.checkboxFieldValue('OTHER').click()
    interestsPage.submitButton().click()

    interestsPage.detailsPageErrorMessage().contains("Enter Daniel Craig's interests")
    interestsPage.detailsFieldErrorMessage().contains("Enter Daniel Craig's interests")
  })

  it('New record - Select COMMUNITY - navigates to interests page', () => {
    const interestsPage = new InterestsPage("What are Daniel Craig's interests?")

    interestsPage.checkboxFieldValue('COMMUNITY').click()

    interestsPage.submitButton().click()

    cy.url().should('include', 'ability-to-work')
  })

  it('New record - Select OTHER - navigates to interests page', () => {
    const interestsPage = new InterestsPage("What are Daniel Craig's interests?")

    interestsPage.checkboxFieldValue('OTHER').click()
    interestsPage.textareaField().type('Some other interest')

    interestsPage.submitButton().click()

    cy.url().should('include', 'ability-to-work')
  })
})