import AbilityToWorkPage from '../pages/abilityToWork'
import AdditionalTrainingPage from '../pages/additionalTraining'
import EducationLevelPage from '../pages/educationLevel'
import HasWorkedBeforePage from '../pages/hasWorkedBefore'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import JobDetailsPage from '../pages/jobDetails'
import ParticularJobInterestsPage from '../pages/particularJobInterests'
import PersonalInterestsPage from '../pages/personalInterests'
import QualificationDetailsPage from '../pages/qualificationDetails'
import QualificationsPage from '../pages/qualifications'
import SkillsPage from '../pages/skills'
import TypeOfWorkExperiencePage from '../pages/typeOfWorkExperience'
import WorkInterestsPage from '../pages/workInterests'
import PlpWorkAndInterestsPage from '../pages/plpWorkAndInterestsPage'
import Page from '../pages/page'
import PlpEducationAndTrainingPage from '../pages/plpEducationAndTrainingPage'
import Error404Page from '../pages/error404'
import Error500Page from '../pages/error500'

context('Update functionality - Full flow', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubPlpPrisonListPageUi')
    cy.task('stubGetFrontEndComponents')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.task('getPrisonerById', 'A3260DZ')
    cy.task('updateCiagPlan', 'A3260DZ')
    cy.task('stubUpdateInduction', 'A3260DZ')
    cy.signIn()
  })

  describe('Happy path scenarios', () => {
    beforeEach(() => {
      cy.task('stubGetInductionLongQuestionSet', 'A3260DZ')
    })

    it('Existing plan - Hoping to get work page', () => {
      cy.visit('/plan/create/A3260DZ/hoping-to-get-work/update')

      const hopingToGetWorkPage = new HopingToGetWorkPage("Is Joe Bloggs hoping to get work when they're released?")

      hopingToGetWorkPage.radioFieldValue('YES').should('be.checked')

      hopingToGetWorkPage.radioFieldValue('NO').click()

      hopingToGetWorkPage.submitButton().click()

      cy.url().should('include', '/reason-to-not-get-work/new')
    })

    it('Existing plan - Qualifications page - Submit', () => {
      // Given
      cy.task('stubPlpEducationAndTrainingPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/qualifications-list/update')

      const qualificationsPage = new QualificationsPage("Joe Bloggs's qualifications")

      // When
      qualificationsPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpEducationAndTrainingPage)
    })

    it('Existing plan - Qualifications page - Add qualification flow', () => {
      // Given
      cy.task('stubPlpEducationAndTrainingPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/qualifications-list/update')

      const qualificationsPage = new QualificationsPage("Joe Bloggs's qualifications")

      qualificationsPage.addQualificationButton().click()

      const educationLevelPage = new EducationLevelPage(
        'What level of secondary school qualification does Joe Bloggs want to add?',
      )

      educationLevelPage.radioFieldValue('LEVEL_4').click()
      educationLevelPage.submitButton().click()

      const qualificationDetailsPage = new QualificationDetailsPage('Add a level 4 qualification')

      qualificationDetailsPage.subjectField().type('Mathematics')
      qualificationDetailsPage.gradeField().type('A')

      qualificationDetailsPage.submitButton().click()

      // When
      qualificationsPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpEducationAndTrainingPage)
    })

    it('Existing plan - Additional training page', () => {
      // Given
      cy.task('stubPlpEducationAndTrainingPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/additional-training/update')

      const additionalTraining = new AdditionalTrainingPage(
        'Does Joe Bloggs have any other training or vocational qualifications?',
      )

      additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()

      // When
      additionalTraining.submitButton().click()

      // Then
      Page.verifyOnPage(PlpEducationAndTrainingPage)
    })

    it('Existing plan - Has worked before page', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/has-worked-before/update')

      const hasWorkedBefore = new HasWorkedBeforePage('Has Joe Bloggs worked before?')

      hasWorkedBefore.radioFieldValue('NO').click()

      // When
      hasWorkedBefore.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - Work experience page', () => {
      cy.visit('/plan/create/A3260DZ/type-of-work-experience/update')

      const typeOfWorkExperiencePage = new TypeOfWorkExperiencePage('What type of work has Joe Bloggs done before?')

      typeOfWorkExperiencePage.checkboxFieldValue('HOSPITALITY').click()

      typeOfWorkExperiencePage.submitButton().click()

      // Go to first details page
      cy.url().should('include', 'work-details/beauty/update')
    })

    it('Existing plan - Work details page', () => {
      cy.visit('/plan/create/A3260DZ/work-details/beauty/update')

      const jobDetailsPage = new JobDetailsPage('What did Joe Bloggs do in their hair, beauty and wellbeing job?')

      jobDetailsPage.submitButton().click()

      cy.url().should('include', 'work-details/cleaning_and_maintenance/update')
    })

    it('Existing plan - Work details page - last job', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/work-details/other/update')

      const jobDetailsPage = new JobDetailsPage('What did Joe Bloggs do in their other job?')

      // When
      jobDetailsPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - Work interests page', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/work-interests/update')

      const workInterestsPage = new WorkInterestsPage('What type of work is Joe Bloggs interested in?')

      workInterestsPage.checkboxFieldValue('HOSPITALITY').click()

      // When
      workInterestsPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - Jobs of particular interests page', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/particular-job-interests/update')

      const particularJobInterestsPage = new ParticularJobInterestsPage(
        'Is Joe Bloggs interested in any particular jobs?',
      )

      // When
      particularJobInterestsPage.textField('OFFICE').type('Office administrator')

      particularJobInterestsPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - Personal interests page', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/personal-interests/update')

      const personalInterests = new PersonalInterestsPage("What are Joe Bloggs's interests?")

      personalInterests.checkboxFieldValue('COMMUNITY').click()

      // When
      personalInterests.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - Skills page', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/skills/update')

      const skillsPage = new SkillsPage('What skills does Joe Bloggs feel they have?')

      skillsPage.checkboxFieldValue('COMMUNICATION').click()

      // When
      skillsPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - Ability to work page', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'A3260DZ')

      cy.visit('/plan/create/A3260DZ/ability-to-work/update')

      const abilityToWorkPage = new AbilityToWorkPage(
        "Is there anything that Joe Bloggs feels may affect their ability to work after they're released?",
      )

      abilityToWorkPage.checkboxFieldValue('LIMITED_BY_OFFENSE').click()

      // When
      abilityToWorkPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })
  })

  describe('Sad path scenarios', () => {
    it(`Should not display the 'Hoping to get work' page given the Induction does not exist for the prisoner`, () => {
      // Then
      cy.task('stubGetInduction404Error', 'A3260DZ')

      // When
      cy.visit('/plan/create/A3260DZ/hoping-to-get-work/update', { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(Error404Page)
    })

    it(`Should not display the 'Hoping to get work' page given the Induction API throws an error`, () => {
      // Then
      cy.task('stubGetInduction500Error', 'A3260DZ')

      // When
      cy.visit('/plan/create/A3260DZ/hoping-to-get-work/update', { failOnStatusCode: false })

      // Then
      Page.verifyOnPage(Error500Page)
    })
  })
})
