import AbilityToWorkPage from '../pages/abilityToWork'
import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import PersonalInterestsPage from '../pages/personalInterests'
import AdditionalTrainingPage from '../pages/additionalTraining'
import ParticularJobInterestsPage from '../pages/particularJobInterests'
import QualificationsPage from '../pages/qualifications'
import SkillsPage from '../pages/skills'
import WorkInterestsPage from '../pages/workInterests'

context('Ability to work page', () => {
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

    const personalInterestsPage = new PersonalInterestsPage("What are Daniel Craig's interests?")

    personalInterestsPage.checkboxFieldValue('COMMUNITY').click()

    personalInterestsPage.submitButton().click()
  })

  it('New record - Validation messages display when no value selected', () => {
    const abilityToWorkPage = new AbilityToWorkPage(
      "Is there anything that Daniel Craig feels may affect their ability to work after they're released?",
    )

    abilityToWorkPage.submitButton().click()

    abilityToWorkPage
      .checkboxPageErrorMessage()
      .contains('Select whether Daniel Craig feels something may affect their ability to work')
    abilityToWorkPage
      .checkboxFieldErrorMessage()
      .contains('Select whether Daniel Craig feels something may affect their ability to work')

    abilityToWorkPage.checkboxFieldValue('OTHER').click()
    abilityToWorkPage.submitButton().click()

    abilityToWorkPage
      .detailsPageErrorMessage()
      .contains('Enter what Daniel Craig feels may affect their ability to work')
    abilityToWorkPage
      .detailsFieldErrorMessage()
      .contains('Enter what Daniel Craig feels may affect their ability to work')
  })

  it('New record - Select LIMITED_BY_OFFENSE - navigates to check-your-answers page', () => {
    const abilityToWorkPage = new AbilityToWorkPage(
      "Is there anything that Daniel Craig feels may affect their ability to work after they're released?",
    )

    abilityToWorkPage.checkboxFieldValue('LIMITED_BY_OFFENSE').click()

    abilityToWorkPage.submitButton().click()

    cy.url().should('include', 'check-your-answers')
  })

  it('New record - Select OTHER - navigates to check-your-answers page', () => {
    const abilityToWorkPage = new AbilityToWorkPage(
      "Is there anything that Daniel Craig feels may affect their ability to work after they're released?",
    )

    abilityToWorkPage.checkboxFieldValue('OTHER').click()
    abilityToWorkPage.textareaField().type('Some other interest')

    abilityToWorkPage.submitButton().click()

    cy.url().should('include', 'check-your-answers')
  })
})
