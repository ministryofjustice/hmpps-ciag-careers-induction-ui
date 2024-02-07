import AdditionalTrainingPage from '../pages/additionalTraining'
import EducationLevelPage from '../pages/educationLevel'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import InPrisonEducationPage from '../pages/inPrisonEducation'
import InPrisonWorkPage from '../pages/inPrisonWork'
import QualificationDetailsPage from '../pages/qualificationDetails'
import QualificationsPage from '../pages/qualifications'
import Page from '../pages/page'
import PlpWorkAndInterestsPage from '../pages/plpWorkAndInterestsPage'
import PlpEducationAndTrainingPage from '../pages/plpEducationAndTrainingPage'

context('Update functionality - Lite flow', () => {
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
    cy.task('getPrisonerById', 'B79237A')
    cy.task('updateCiagPlan', 'B79237A')
    cy.signIn()
  })

  describe('Happy path scenarios', () => {
    beforeEach(() => {
      cy.task('stubGetInductionShortQuestionSet', 'B79237A')
    })

    it('Existing plan - Hoping to get work page - Change to positive', () => {
      cy.visit('/plan/create/B79237A/hoping-to-get-work/update')

      const hopingToGetWorkPage = new HopingToGetWorkPage("Is Jane Doe hoping to get work when they're released?")

      hopingToGetWorkPage.radioFieldValue('NO').should('be.checked')

      hopingToGetWorkPage.radioFieldValue('YES').click()

      hopingToGetWorkPage.submitButton().click()

      cy.url().should('include', '/qualifications-list/new')
    })

    it('Existing plan - Hoping to get work page - Change to other negative', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'B79237A')

      cy.visit('/plan/create/B79237A/hoping-to-get-work/update')

      const hopingToGetWorkPage = new HopingToGetWorkPage("Is Jane Doe hoping to get work when they're released?")

      hopingToGetWorkPage.radioFieldValue('NO').should('be.checked')

      hopingToGetWorkPage.radioFieldValue('NOT_SURE').click()

      // When
      hopingToGetWorkPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - Qualifications page - Submit', () => {
      // Given
      cy.task('stubPlpEducationAndTrainingPageUi', 'B79237A')

      cy.visit('/plan/create/B79237A/qualifications-list/update')

      const qualificationsPage = new QualificationsPage("Jane Doe's qualifications")

      // When
      qualificationsPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpEducationAndTrainingPage)
    })

    it('Existing plan - Qualifications page - Add qualification flow', () => {
      // Given
      cy.task('stubPlpEducationAndTrainingPageUi', 'B79237A')

      cy.visit('/plan/create/B79237A/qualifications-list/update')

      const qualificationsPage = new QualificationsPage("Jane Doe's qualifications")

      qualificationsPage.addQualificationButton().click()

      const educationLevelPage = new EducationLevelPage(
        'What level of secondary school qualification does Jane Doe want to add?',
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
      cy.task('stubPlpEducationAndTrainingPageUi', 'B79237A')

      cy.visit('/plan/create/B79237A/additional-training/update')

      const additionalTraining = new AdditionalTrainingPage(
        'Does Jane Doe have any other training or vocational qualifications?',
      )

      additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()

      // When
      additionalTraining.submitButton().click()

      // Then
      Page.verifyOnPage(PlpEducationAndTrainingPage)
    })

    it('Existing plan - In prison work page', () => {
      // Given
      cy.task('stubPlpWorkAndInterestsPageUi', 'B79237A')

      cy.visit('/plan/create/B79237A/in-prison-work/update')

      const inPrisonWorkPage = new InPrisonWorkPage(`What type of work would Jane Doe like to do in prison?`)

      inPrisonWorkPage.checkboxFieldValue('TEXTILES_AND_SEWING').click()

      // When
      inPrisonWorkPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
    })

    it('Existing plan - In prison education', () => {
      // Given
      cy.task('stubPlpEducationAndTrainingPageUi', 'B79237A')

      cy.visit('/plan/create/B79237A/in-prison-education/update')

      const inPrisonEducation = new InPrisonEducationPage(
        `What type of training and education activities would Jane Doe like to do in prison?`,
      )

      inPrisonEducation.checkboxFieldValue('WELDING_AND_METALWORK').click()

      // When
      inPrisonEducation.submitButton().click()

      // Then
      Page.verifyOnPage(PlpEducationAndTrainingPage)
    })
  })
})
