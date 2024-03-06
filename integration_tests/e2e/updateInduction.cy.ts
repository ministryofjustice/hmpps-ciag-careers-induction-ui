import type { UpdateInductionRequest } from 'educationAndWorkPlanApiClient'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import ReasonToNotGetWork from '../pages/reasonToNotGetWork'
import QualificationsPage from '../pages/qualifications'
import AdditionalTrainingPage from '../pages/additionalTraining'
import InPrisonWorkPage from '../pages/inPrisonWork'
import InPrisonEducationPage from '../pages/inPrisonEducation'
import Page from '../pages/page'
import CheckYourAnswersPage from '../pages/checkYourAnswers'
import PlpWorkAndInterestsPage from '../pages/plpWorkAndInterestsPage'

context(
  `Update an Induction to change it's question set, resulting going through the whole journey to Check Your Answers and on to PLP`,
  () => {
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
      cy.task('stubUpdateInduction')
      cy.task('stubPlpWorkAndInterestsPageUi', 'G6115VJ')
      cy.signIn()
    })

    it('should update a long question Induction to short question set', () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')
      cy.visit('/plan/create/G6115VJ/hoping-to-get-work/update')

      const hopingToGetWorkPage = new HopingToGetWorkPage(`Is Daniel Craig hoping to get work when they're released?`)
      hopingToGetWorkPage.radioFieldValue('NO').click()
      hopingToGetWorkPage.submitButton().click()

      const reasonToNotGetWork = new ReasonToNotGetWork('What could stop Daniel Craig working when they are released?')
      reasonToNotGetWork.checkboxFieldValue('RETIRED').click()
      reasonToNotGetWork.submitButton().click()

      const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
      qualificationsPage.submitButton().click()

      const additionalTraining = new AdditionalTrainingPage(
        'Does Daniel Craig have any other training or vocational qualifications?',
      )
      additionalTraining.checkboxFieldValue('CSCS_CARD').click()
      additionalTraining.submitButton().click()

      const inPrisonWorkPage = new InPrisonWorkPage(`What type of work would Daniel Craig like to do in prison?`)
      inPrisonWorkPage.checkboxFieldValue('WOODWORK_AND_JOINERY').click()
      inPrisonWorkPage.submitButton().click()

      const inPrisonEducation = new InPrisonEducationPage(
        `What type of training and education activities would Daniel Craig like to do in prison?`,
      )
      inPrisonEducation.checkboxFieldValue('CATERING').click()
      inPrisonEducation.submitButton().click()

      // When
      const checkYourAnswersPage = Page.verifyOnPage(CheckYourAnswersPage)
      checkYourAnswersPage.submitButton().click()

      // Then
      Page.verifyOnPage(PlpWorkAndInterestsPage)
      cy.task<UpdateInductionRequest>('getUpdateInductionRequestBody', 'G6115VJ')
        .then(request => {
          return request.reference
        })
        .should('equal', '814ade0a-a3b2-46a3-862f-79211ba13f7b')
    })
  },
)
