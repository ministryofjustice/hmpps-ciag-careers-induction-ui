import AdditionalTrainingPage from '../pages/additionalTraining'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import InPrisonEducationPage from '../pages/inPrisonEducation'
import InPrisonWorkPage from '../pages/inPrisonWork'
import ReasonToNotGetWork from '../pages/reasonToNotGetWork'
import WantsToAddQualifications from '../pages/wantsToAddQualifications'

context('In prison education work page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getActionPlanList')
    cy.task('getCiagPlan')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('getLearnerEducation')
    cy.task('getPrisonersByCaseloadId', 'MDI')
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work/new')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('NOT_SURE').click()
    hopingToGetWorkPage.submitButton().click()

    const reasonToNotGetWork = new ReasonToNotGetWork(
      "Why is Daniel Craig not hoping to get work when they're released?",
    )

    reasonToNotGetWork.checkboxFieldValue('OTHER').click()
    reasonToNotGetWork.textareaField().clear().type('other details')
    reasonToNotGetWork.submitButton().click()

    const wantsToAddQualifications = new WantsToAddQualifications("Daniel Craig's qualifications")
    wantsToAddQualifications.radioFieldValue('NO').click()
    wantsToAddQualifications.submitButton().click()

    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()
    additionalTraining.checkboxFieldValue('OTHER').click()
    additionalTraining.textareaField().type('Some other training')
    additionalTraining.submitButton().click()

    const inPrisonWorkPage = new InPrisonWorkPage(`What type of work would Daniel Craig like to do in prison?`)

    inPrisonWorkPage.checkboxFieldValue('OTHER').click()
    inPrisonWorkPage.textareaField().clear().type('other details')
    inPrisonWorkPage.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const inPrisonEducation = new InPrisonEducationPage(
      `What type of training and education activities would Daniel Craig like to do in prison?`,
    )

    inPrisonEducation.submitButton().click()

    inPrisonEducation
      .checkboxPageErrorMessage()
      .contains('Select the type of training Daniel Craig would like to do in prison')
  })

  it('Select OTHER - no details given, display appropriate message', () => {
    const inPrisonEducation = new InPrisonEducationPage(
      `What type of training and education activities would Daniel Craig like to do in prison?`,
    )

    inPrisonEducation.checkboxFieldValue('OTHER').click()
    inPrisonEducation.textareaField().clear()
    inPrisonEducation.submitButton().click()

    inPrisonEducation
      .detailsFieldErrorMessage()
      .should('contain', 'Enter the type of type of training Daniel Craig would like to do in prison')
  })

  it('Select OTHER - enter text with more characters than allowed', () => {
    const inPrisonEducation = new InPrisonEducationPage(
      `What type of training and education activities would Daniel Craig like to do in prison?`,
    )

    const longStr = 'x'.repeat(201)

    inPrisonEducation.checkboxFieldValue('OTHER').click()
    inPrisonEducation.textareaField().clear().type(longStr)
    inPrisonEducation.submitButton().click()

    inPrisonEducation.detailsFieldErrorMessage().should('contain', 'Training in prison must be 200 characters or less')
  })

  it('Select OTHER - details entered - navigate to qualifications page', () => {
    const inPrisonEducation = new InPrisonEducationPage(
      `What type of training and education activities would Daniel Craig like to do in prison?`,
    )

    inPrisonEducation.checkboxFieldValue('OTHER').click()
    inPrisonEducation.textareaField().clear().type('other details')
    inPrisonEducation.submitButton().click()

    cy.url().should('include', 'check-your-answers')
  })
})
