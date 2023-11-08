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

context('Update functionality - Full flow', () => {
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
    cy.task('getPrisonerById', 'A3260DZ')
    cy.task('getCiagPlan', 'A3260DZ')
    cy.task('updateCiagPlan', 'A3260DZ')
    cy.task('learningPlanPage', 'A3260DZ')
    cy.signIn()
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
    cy.visit('/plan/create/A3260DZ/qualifications-list/update')

    const qualificationsPage = new QualificationsPage("Joe Bloggs's qualifications")

    qualificationsPage.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/education-and-training')
  })

  it('Existing plan - Qualifications page - Add qualification flow', () => {
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

    qualificationsPage.submitButton().click()
    cy.url().should('include', '/plan/A3260DZ/view/education-and-training')
  })

  it('Existing plan - Additional training page', () => {
    cy.visit('/plan/create/A3260DZ/additional-training/update')

    const additionalTraining = new AdditionalTrainingPage(
      'Does Joe Bloggs have any other training or vocational qualifications?',
    )

    additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()

    additionalTraining.submitButton().click()
    cy.url().should('include', '/plan/A3260DZ/view/education-and-training')
  })

  it('Existing plan - Has worked before page', () => {
    cy.visit('/plan/create/A3260DZ/has-worked-before/update')

    const hasWorkedBefore = new HasWorkedBeforePage('Has Joe Bloggs worked before?')

    hasWorkedBefore.radioFieldValue('NO').click()

    hasWorkedBefore.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/work-and-interests')
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
    cy.visit('/plan/create/A3260DZ/work-details/other/update')

    const jobDetailsPage = new JobDetailsPage('What did Joe Bloggs do in their other job?')

    jobDetailsPage.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/work-and-interests')
  })

  it('Existing plan - Work interests page', () => {
    cy.visit('/plan/create/A3260DZ/work-interests/update')

    const workInterestsPage = new WorkInterestsPage('What type of work is Joe Bloggs interested in?')

    workInterestsPage.checkboxFieldValue('HOSPITALITY').click()

    workInterestsPage.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/work-and-interests')
  })

  it('Existing plan - Jobs of particular interests page', () => {
    cy.visit('/plan/create/A3260DZ/particular-job-interests/update')

    const particularJobInterestsPage = new ParticularJobInterestsPage(
      'Is Joe Bloggs interested in any particular jobs?',
    )

    particularJobInterestsPage.textField('OFFICE').type('A valid value')

    particularJobInterestsPage.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/work-and-interests')
  })

  it('Existing plan - Personal interests page', () => {
    cy.visit('/plan/create/A3260DZ/personal-interests/update')

    const personalInterests = new PersonalInterestsPage("What are Joe Bloggs's interests?")

    personalInterests.checkboxFieldValue('COMMUNITY').click()

    personalInterests.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/work-and-interests')
  })

  it('Existing plan - Skills page', () => {
    cy.visit('/plan/create/A3260DZ/skills/update')

    const skillsPage = new SkillsPage('What skills does Joe Bloggs feel they have?')

    skillsPage.checkboxFieldValue('COMMUNICATION').click()

    skillsPage.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/work-and-interests')
  })

  it('Existing plan - Ability to work page', () => {
    cy.visit('/plan/create/A3260DZ/ability-to-work/update')

    const abilityToWorkPage = new AbilityToWorkPage(
      "Is there anything that Joe Bloggs feels may affect their ability to work after they're released?",
    )

    abilityToWorkPage.checkboxFieldValue('LIMITED_BY_OFFENSE').click()

    abilityToWorkPage.submitButton().click()

    cy.url().should('include', '/plan/A3260DZ/view/work-and-interests')
  })
})
