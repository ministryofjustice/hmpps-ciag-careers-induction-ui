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
import QualificationLevelPage from '../pages/qualificationLevel'
import QualificationDetailsPage from '../pages/qualificationDetails'
import TypeOfWorkExperiencePage from '../pages/typeOfWorkExperience'
import JobDetailsPage from '../pages/jobDetails'
import CheckYourAnswersPage from '../pages/checkYourAnswers'

context('Check your answers - Full flow', () => {
  before(() => {
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
    hopingToGetWorkPage.radioFieldValue('YES').click()
    hopingToGetWorkPage.submitButton().click()

    const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
    qualificationsPage.submitButton().click()

    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )
    educationLevelPage.radioFieldValue('SECONDARY_SCHOOL_TOOK_EXAMS').click()
    educationLevelPage.submitButton().click()

    const qualificationLevelPage = new QualificationLevelPage(
      'What level of secondary school qualification does Daniel Craig want to add?',
    )

    qualificationLevelPage.radioFieldValue('LEVEL_1').click()
    qualificationLevelPage.submitButton().click()

    const qualificationDetailsPage = new QualificationDetailsPage('Add a level 1 qualification')

    qualificationDetailsPage.subjectField().type('Mathematics')
    qualificationDetailsPage.gradeField().type('A')

    qualificationDetailsPage.submitButton().click()

    qualificationsPage.submitButton().click()

    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    additionalTraining.checkboxFieldValue('FULL_UK_DRIVING_LICENCE').click()
    additionalTraining.checkboxFieldValue('OTHER').click()
    additionalTraining.textareaField().type('Some other training')
    additionalTraining.submitButton().click()

    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')

    hasWorkedBefore.radioFieldValue('YES').click()
    hasWorkedBefore.submitButton().click()

    const typeOfWorkExperiencePage = new TypeOfWorkExperiencePage('What type of work has Daniel Craig done before?')

    typeOfWorkExperiencePage.checkboxFieldValue('HOSPITALITY').click()
    typeOfWorkExperiencePage.checkboxFieldValue('OTHER').click()
    typeOfWorkExperiencePage.textareaField().type('Some other job')

    typeOfWorkExperiencePage.submitButton().click()

    let jobDetailsPage = new JobDetailsPage('What did Daniel Craig do in their Hospitality and catering job?')
    jobDetailsPage.roleField().type('Mock Hospitality Role')
    jobDetailsPage.detailsField().type('Mock Hospitality Details')

    jobDetailsPage.submitButton().click()

    jobDetailsPage = new JobDetailsPage('What did Daniel Craig do in their Other job?')

    jobDetailsPage.roleField().type('Mock Other Role')
    jobDetailsPage.detailsField().type('Mock Other Details')

    jobDetailsPage.submitButton().click()

    const workInterestsPage = new WorkInterestsPage('What type of work is Daniel Craig interested in?')

    workInterestsPage.checkboxFieldValue('HOSPITALITY').click()
    workInterestsPage.checkboxFieldValue('OTHER').click()
    workInterestsPage.textareaField().type('Some other work interest')
    workInterestsPage.submitButton().click()

    const particularJobInterestsPage = new ParticularJobInterestsPage(
      'Is Daniel Craig interested in any particular jobs?',
    )

    particularJobInterestsPage.textField('HOSPITALITY').type('A hospitality job')
    particularJobInterestsPage.submitButton().click()

    const skillsPage = new SkillsPage('What skills does Daniel Craig feel they have?')

    skillsPage.checkboxFieldValue('COMMUNICATION').click()
    skillsPage.checkboxFieldValue('OTHER').click()
    skillsPage.textareaField().type('Some other skill')

    skillsPage.submitButton().click()

    const personalInterestsPage = new PersonalInterestsPage("What are Daniel Craig's interests?")

    personalInterestsPage.checkboxFieldValue('COMMUNITY').click()
    personalInterestsPage.checkboxFieldValue('OTHER').click()
    personalInterestsPage.textareaField().type('Some other interest')

    personalInterestsPage.submitButton().click()

    const abilityToWorkPage = new AbilityToWorkPage(
      "Is there anything that Daniel Craig feels may affect their ability to work after they're released?",
    )

    abilityToWorkPage.checkboxFieldValue('LIMITED_BY_OFFENSE').click()
    abilityToWorkPage.checkboxFieldValue('OTHER').click()
    abilityToWorkPage.textareaField().type('Some other limitation')

    abilityToWorkPage.submitButton().click()
  })

  it('New record - Full flow - Values have been set correctly, change links work', () => {
    const checkYourAnswersPage = new CheckYourAnswersPage(
      "Check and save your answers before adding Daniel Craig's goals",
    )

    checkYourAnswersPage.hopingToGetWork().contains('Yes')
    checkYourAnswersPage.hopingToGetWorkLink().click()
    const hopingToGetWorkPage = new HopingToGetWorkPage("Is Daniel Craig hoping to get work when they're released?")
    hopingToGetWorkPage.backLink().click()

    checkYourAnswersPage.qualifications().contains('Level 1')
    checkYourAnswersPage.qualifications().contains('Mathematics')
    checkYourAnswersPage.qualifications().contains('A')
    checkYourAnswersPage.qualificationsLink().click()
    const qualificationsPage = new QualificationsPage("Daniel Craig's qualifications")
    qualificationsPage.backLink().click()

    checkYourAnswersPage.educationLevel().contains('Secondary school, took exams')
    checkYourAnswersPage.educationLevelLink().click()
    const educationLevelPage = new EducationLevelPage(
      "What's the highest level of education Daniel Craig has completed?",
    )
    educationLevelPage.backLink().click()

    checkYourAnswersPage.additionalTraining().contains('Full UK driving licence')
    checkYourAnswersPage.additionalTraining().contains('Other - Some other training')
    checkYourAnswersPage.additionalTrainingLink().click()
    const additionalTraining = new AdditionalTrainingPage(
      'Does Daniel Craig have any other training or vocational qualifications?',
    )
    additionalTraining.backLink().click()

    checkYourAnswersPage.hasWorkedBefore().contains('Yes')
    checkYourAnswersPage.hasWorkedBeforeLink().click()
    const hasWorkedBefore = new HasWorkedBeforePage('Has Daniel Craig worked before?')
    hasWorkedBefore.backLink().click()

    checkYourAnswersPage.typeOfWorkExperience().contains('Hospitality and catering')
    checkYourAnswersPage.typeOfWorkExperience().contains('Other - Some other job')
    checkYourAnswersPage.typeOfWorkExperienceLink().click()
    const typeOfWorkExperiencePage = new TypeOfWorkExperiencePage('What type of work has Daniel Craig done before?')
    typeOfWorkExperiencePage.backLink().click()

    checkYourAnswersPage.workExperienceItemRole(1).contains('Mock Hospitality Role')
    checkYourAnswersPage.workExperienceItemDetails(1).contains('Mock Hospitality Detail')
    checkYourAnswersPage.workExperienceItemLink(1).click()
    let jobDetailsPage = new JobDetailsPage('What did Daniel Craig do in their Hospitality and catering job?')
    jobDetailsPage.backLink().click()

    checkYourAnswersPage.workExperienceItemRole(2).contains('Mock Other Role')
    checkYourAnswersPage.workExperienceItemDetails(2).contains('Mock Other Detail')
    checkYourAnswersPage.workExperienceItemLink(2).click()
    jobDetailsPage = new JobDetailsPage('What did Daniel Craig do in their Other job?')
    jobDetailsPage.backLink().click()

    checkYourAnswersPage.workInterests().contains('Hospitality and catering')
    checkYourAnswersPage.workInterests().contains('Other - Some other work interest')
    checkYourAnswersPage.workInterestsLink().click()
    const workInterestsPage = new WorkInterestsPage('What type of work is Daniel Craig interested in?')
    workInterestsPage.backLink().click()

    checkYourAnswersPage.particularJobInterests().contains('Hospitality and catering:')
    checkYourAnswersPage.particularJobInterests().contains('A hospitality job')
    checkYourAnswersPage.particularJobInterestsLink().click()
    const particularJobInterestsPage = new ParticularJobInterestsPage(
      'Is Daniel Craig interested in any particular jobs?',
    )
    particularJobInterestsPage.backLink().click()

    checkYourAnswersPage.skills().contains('Communication')
    checkYourAnswersPage.skills().contains('Other - Some other skill')
    checkYourAnswersPage.skillsLink().click()
    const skillsPage = new SkillsPage('What skills does Daniel Craig feel they have?')
    skillsPage.backLink().click()

    checkYourAnswersPage.personalInterests().contains('Community')
    checkYourAnswersPage.personalInterests().contains('Other - Some other interest')
    checkYourAnswersPage.personalInterestsLink().click()
    const personalInterestsPage = new PersonalInterestsPage("What are Daniel Craig's interests?")
    personalInterestsPage.backLink().click()

    checkYourAnswersPage.abilityToWork().contains('Feels type of offence will limit their ability to find work')
    checkYourAnswersPage.abilityToWork().contains('Other - Some other limitation')
    checkYourAnswersPage.abilityToWorkLink().click()
    const abilityToWorkPage = new AbilityToWorkPage(
      "Is there anything that Daniel Craig feels may affect their ability to work after they're released?",
    )
    abilityToWorkPage.backLink().click()
  })
})
