import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
import EducationLevelValue from '../../../enums/educationLevelValue'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import InPrisonEducationValue from '../../../enums/inPrisonEducationValue'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import SkillsValue from '../../../enums/skillsValue'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import YesNoValue from '../../../enums/yesNoValue'
import CreateCiagPlanArgs from '../interfaces/createCiagPlanArgs'
import CiagPlan from '../interfaces/ciagPlan'

export default class FlowUpdateCiagPlanRequest {
  constructor(data: CreateCiagPlanArgs, existingPlan: CiagPlan) {
    const now = new Date()
    const isoString = now.toISOString()

    this.reference = existingPlan.reference
    this.offenderId = existingPlan.offenderId
    this.prisonId = data.prisonId

    this.workOnReleaseReference = existingPlan.workOnReleaseReference
    this.desireToWork = data.hopingToGetWork === HopingToGetWorkValue.YES
    this.hopingToGetWork = data.hopingToGetWork

    this.reasonToNotGetWork = data.hopingToGetWork !== HopingToGetWorkValue.YES ? data.reasonToNotGetWork : []
    this.reasonToNotGetWorkOther = data.hopingToGetWork !== HopingToGetWorkValue.YES ? data.reasonToNotGetWorkOther : ''

    this.abilityToWork = data.abilityToWork || []
    this.abilityToWorkOther = data.abilityToWorkOther

    this.createdBy = data.currentUser
    this.createdDateTime = isoString

    this.modifiedBy = data.currentUser
    this.modifiedDateTime = isoString

    this.prisonName = data.prisonName

    // Retain existing values based on flow
    this.workExperience =
      data.hopingToGetWork === HopingToGetWorkValue.YES
        ? {
            reference: existingPlan.workExperience?.reference,
            hasWorkedBefore: data.hasWorkedBefore === YesNoValue.YES,
            typeOfWorkExperience: data.typeOfWorkExperience,
            typeOfWorkExperienceOther: data.typeOfWorkExperienceOther,
            workExperience: data.workExperience,
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
            workInterests: {
              workInterests: data.workInterests,
              workInterestsOther: data.workInterestsOther,
              particularJobInterests: data.particularJobInterests,
              modifiedBy: data.currentUser,
              modifiedDateTime: isoString,
            },
          }
        : existingPlan.workExperience

    // Retain existing values vbased on flow
    this.skillsAndInterests =
      data.hopingToGetWork === HopingToGetWorkValue.YES
        ? {
            reference: existingPlan.skillsAndInterests?.reference,
            skills: data.skills,
            skillsOther: data.skillsOther,
            personalInterests: data.personalInterests,
            personalInterestsOther: data.personalInterestsOther,
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
          }
        : existingPlan.skillsAndInterests

    this.qualificationsAndTraining = {
      qualificationsReference: existingPlan.qualificationsAndTraining?.qualificationsReference,
      educationLevel: data.educationLevel,
      qualifications: data.qualifications,
      trainingReference: existingPlan.qualificationsAndTraining?.trainingReference,
      additionalTraining: data.additionalTraining,
      additionalTrainingOther: data.additionalTrainingOther,
      modifiedBy: data.currentUser,
      modifiedDateTime: isoString,
    }

    // Retain existing values based on flow
    this.inPrisonInterests =
      data.hopingToGetWork !== HopingToGetWorkValue.YES
        ? {
            reference: existingPlan.inPrisonInterests?.reference,
            inPrisonWork: data.inPrisonWork,
            inPrisonWorkOther: data.inPrisonWorkOther,
            inPrisonEducation: data.inPrisonEducation,
            inPrisonEducationOther: data.inPrisonEducationOther,
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
          }
        : existingPlan.inPrisonInterests
  }

  // Properties
  reference: string

  offenderId: string

  prisonId: string

  workOnReleaseReference: string

  desireToWork: boolean

  hopingToGetWork: HopingToGetWorkValue

  reasonToNotGetWork?: Array<ReasonToNotGetWorkValue>

  reasonToNotGetWorkOther?: string

  abilityToWork: Array<AbilityToWorkValue>

  abilityToWorkOther?: string

  createdBy: string

  createdDateTime: string

  modifiedBy: string

  modifiedDateTime: string

  prisonName: string

  workExperience?: {
    reference?: string
    hasWorkedBefore: boolean
    typeOfWorkExperience?: Array<TypeOfWorkExperienceValue>
    typeOfWorkExperienceOther?: string
    workExperience?: Array<{
      typeOfWorkExperience: TypeOfWorkExperienceValue
      role: string
      details: string
    }>
    modifiedBy: string
    modifiedDateTime: string

    workInterests?: {
      reference?: string
      workInterests: Array<WorkInterestsValue>
      workInterestsOther?: string
      particularJobInterests: Array<{
        workInterest: WorkInterestsValue
        role: string
      }>
      modifiedBy: string
      modifiedDateTime: string
    }
  }

  skillsAndInterests?: {
    reference?: string
    skills: Array<SkillsValue>
    skillsOther?: string
    personalInterests: Array<PersonalInterestsValue>
    personalInterestsOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }

  qualificationsAndTraining?: {
    qualificationsReference?: string
    educationLevel?: EducationLevelValue
    qualifications?: Array<{
      subject: string
      grade: string
      level: QualificationLevelValue
    }>
    trainingReference?: string
    additionalTraining: Array<AdditionalTrainingValue>
    additionalTrainingOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }

  inPrisonInterests?: {
    reference?: string
    inPrisonWork: Array<InPrisonWorkValue>
    inPrisonWorkOther?: string
    inPrisonEducation: Array<InPrisonEducationValue>
    inPrisonEducationOther?: string
    modifiedBy: string
    modifiedDateTime: string
  }
}
