import HopingToGetWorkPage from '../pages/hopingToGetWork'
import AdditionalTrainingPage from '../pages/additionalTraining'
import QualificationsPage from '../pages/qualifications'
import QualificationLevelPage from '../pages/qualificationLevel'
import QualificationDetailsPage from '../pages/qualificationDetails'
import ReasonToNotGetWorkPage from '../pages/reasonToNotGetWork'
import WantsToAddQualifications from '../pages/wantsToAddQualifications'
import CheckYourAnswersPage from '../pages/checkYourAnswers'
import InPrisonWorkPage from '../pages/inPrisonWork'
import InPrisonEducationPage from '../pages/inPrisonEducation'

context('Check your answers - Lite flow', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubPlpPrisonListPageUi')
    cy.task('stubGetFrontEndComponents')
    cy.task('getPrisonerById')
    cy.task('getCiagPlan')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work/new')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")
    hopingToGetWorkPage.radioFieldValue('NO').click()
    hopingToGetWorkPage.submitButton().click()

    const reasonToNotGetWorkPage = new ReasonToNotGetWorkPage(
      'What could stop Daniel Craig working when they are released?',
    )
    reasonToNotGetWorkPage.checkboxFieldValue('FULL_TIME_CARER').click()
    reasonToNotGetWorkPage.checkboxFieldValue('OTHER').click()
    reasonToNotGetWorkPage.textareaField().type('Some other reason')
    reasonToNotGetWorkPage.submitButton().click()

    const wantsToAddQualifications = new WantsToAddQualifications("Daniel Craig's qualifications")
    wantsToAddQualifications.radioFieldValue('YES').click()
    wantsToAddQualifications.submitButton().click()

    const qualificationLevelPage = new QualificationLevelPage(
      'What level of qualification does Daniel Craig want to add?',
    )

    qualificationLevelPage.radioFieldValue('LEVEL_8').click()
    qualificationLevelPage.submitButton().click()

    const qualificationDetailsPage = new QualificationDetailsPage('Add a degree qualification')

    qualificationDetailsPage.subjectField().type('Mathematics')
    qualificationDetailsPage.gradeField().type('1st')

    qualificationDetailsPage.submitButton().click()

    const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
    qualificationsPage.submitButton().click()

    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()
    additionalTraining.checkboxFieldValue('OTHER').click()
    additionalTraining.textareaField().type('Some other training')
    additionalTraining.submitButton().click()

    const inPrisonWorkPage = new InPrisonWorkPage('What type of work would Daniel Craig like to do in prison?')
    inPrisonWorkPage.checkboxFieldValue('COMPUTERS_OR_DESK_BASED').click()
    inPrisonWorkPage.checkboxFieldValue('OTHER').click()
    inPrisonWorkPage.textareaField().type('Some other in prison work')
    inPrisonWorkPage.submitButton().click()

    const inPrisonEducationPage = new InPrisonEducationPage(
      'What type of training and education activities would Daniel Craig like to do in prison?',
    )
    inPrisonEducationPage.checkboxFieldValue('BARBERING_AND_HAIRDRESSING').click()
    inPrisonEducationPage.checkboxFieldValue('OTHER').click()
    inPrisonEducationPage.textareaField().type('Some other in prison education')
    inPrisonEducationPage.submitButton().click()
  })

  it('New record - Lite flow - Values have been set correctly, change links work', () => {
    const checkYourAnswersPage = new CheckYourAnswersPage(
      "Check and save your answers before adding Daniel Craig's goals",
    )

    checkYourAnswersPage.hopingToGetWork().contains('No')
    checkYourAnswersPage.hopingToGetWorkLink().click()
    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")
    hopingToGetWorkPage.backLink().click()

    checkYourAnswersPage.reasonToNotGetWork().contains('Has full-time caring responsibilities')
    checkYourAnswersPage.reasonToNotGetWork().contains('Other - Some other reason')
    checkYourAnswersPage.reasonToNotGetWorkLink().click()
    const reasonToNotGetWorkPage = new ReasonToNotGetWorkPage(
      'What could stop Daniel Craig working when they are released?',
    )
    reasonToNotGetWorkPage.backLink().click()

    checkYourAnswersPage.wantsToAddQualifications().contains('Yes')
    checkYourAnswersPage.wantsToAddQualificationsLink().click()
    const wantsToAddQualifications = new WantsToAddQualifications("Daniel Craig's qualifications")
    wantsToAddQualifications.backLink().click()

    checkYourAnswersPage.qualifications().contains('Level 8')
    checkYourAnswersPage.qualifications().contains('Mathematics')
    checkYourAnswersPage.qualifications().contains('1st')
    checkYourAnswersPage.qualificationsLink().click()
    const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
    qualificationsPage.backLink().click()

    checkYourAnswersPage.additionalTraining().contains('Full UK driving licence')
    checkYourAnswersPage.additionalTraining().contains('Other - Some other training')
    checkYourAnswersPage.additionalTrainingLink().click()
    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    additionalTraining.backLink().click()

    checkYourAnswersPage.inPrisonWork().contains('Computers or desk-based')
    checkYourAnswersPage.inPrisonWork().contains('Other - Some other in prison work')
    checkYourAnswersPage.inPrisonWorkLink().click()
    const inPrisonWorkPage = new InPrisonWorkPage('What type of work would Daniel Craig like to do in prison?')
    inPrisonWorkPage.backLink().click()

    checkYourAnswersPage.inPrisonEducation().contains('Barbering and hairdressing')
    checkYourAnswersPage.inPrisonEducation().contains('Other - Some other in prison education')
    checkYourAnswersPage.inPrisonEducationLink().click()
    const inPrisonEducationPage = new InPrisonEducationPage(
      'What type of training and education activities would Daniel Craig like to do in prison?',
    )
    inPrisonEducationPage.backLink().click()
  })
})
