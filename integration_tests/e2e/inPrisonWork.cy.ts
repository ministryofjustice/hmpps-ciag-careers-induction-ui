import AdditionalTrainingPage from '../pages/additionalTraining'
import HopingToGetWorkPage from '../pages/hopingToGetWork'
import InPrisonWorkPage from '../pages/inPrisonWork'
import ReasonToNotGetWork from '../pages/reasonToNotGetWork'
import WantsToAddQualifications from '../pages/wantsToAddQualifications'

context('In prison work page', () => {
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
    cy.signIn()

    cy.visit('/plan/create/G6115VJ/hoping-to-get-work/new')

    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")

    hopingToGetWorkPage.radioFieldValue('NOT_SURE').click()
    hopingToGetWorkPage.submitButton().click()

    const reasonToNotGetWork = new ReasonToNotGetWork('What could stop Daniel Craig working when they are released?')

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
  })

  it('Validation messages display when no value selected', () => {
    const inPrisonWorkPage = new InPrisonWorkPage(`What type of work would Daniel Craig like to do in prison?`)

    inPrisonWorkPage.submitButton().click()

    inPrisonWorkPage
      .checkboxPageErrorMessage()
      .contains('Select the type of work Daniel Craig would like to do in prison')
  })

  it('Select OTHER - no details given, display appropriate message', () => {
    const inPrisonWorkPage = new InPrisonWorkPage(`What type of work would Daniel Craig like to do in prison?`)

    inPrisonWorkPage.checkboxFieldValue('OTHER').click()
    inPrisonWorkPage.textareaField().clear()
    inPrisonWorkPage.submitButton().click()

    inPrisonWorkPage
      .detailsFieldErrorMessage()
      .should('contain', 'Enter the type of work Daniel Craig would like to do in prison')
  })

  it('Select OTHER - enter text with more characters than allowed', () => {
    const inPrisonWorkPage = new InPrisonWorkPage(`What type of work would Daniel Craig like to do in prison?`)

    const longStr = 'x'.repeat(201)

    inPrisonWorkPage.checkboxFieldValue('OTHER').click()
    inPrisonWorkPage.textareaField().clear().type(longStr)
    inPrisonWorkPage.submitButton().click()

    inPrisonWorkPage
      .detailsFieldErrorMessage()
      .should('contain', 'Type of work experience must be 200 characters or less')
  })

  it('Select OTHER - details entered - navigate to qualifications page', () => {
    const inPrisonWorkPage = new InPrisonWorkPage(`What type of work would Daniel Craig like to do in prison?`)

    inPrisonWorkPage.checkboxFieldValue('OTHER').click()
    inPrisonWorkPage.textareaField().clear().type('other details')
    inPrisonWorkPage.submitButton().click()

    cy.visit('/plan/create/G6115VJ/in-prison-education/new')
  })
})
