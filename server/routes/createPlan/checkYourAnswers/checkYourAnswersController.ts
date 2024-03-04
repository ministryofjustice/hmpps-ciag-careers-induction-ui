import { RequestHandler, Request, Response } from 'express'

import { plainToClass } from 'class-transformer'
import addressLookup from '../../addressLookup'
import config from '../../../config'
import { deleteSessionData, getSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import FlowUpdateCiagPlanRequest from '../../../data/ciagApi/models/flowUpdateCiagPlanRequest'
import InductionService from '../../../services/inductionService'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import CiagPlan from '../../../data/ciagApi/interfaces/ciagPlan'
import YesNoValue from '../../../enums/yesNoValue'

export default class CheckYourAnswersController {
  constructor(private readonly inductionService: InductionService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to hopingToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      const data = {
        id,
        record,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        statusChange: getSessionData(req, ['changeStatus', id], false),
      }

      res.render('pages/createPlan/checkYourAnswers/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      // Check if the Induction is being updated
      if (getSessionData(req, ['isUpdateFlow', id])) {
        await this.updateInduction(req, res)
        res.redirect(addressLookup.learningPlan.profile(id))
      } else {
        // else we are creating a new Induction
        await this.createNewInduction(req, res)
        res.redirect(`${config.learningPlanUrl}/plan/${id}/induction-created`)
      }
    } catch (err) {
      next(err)
    }
  }

  private async updateInduction(req: Request, res: Response) {
    const { id } = req.params
    const { plan } = req.context
    const updatedFormObject = getInductionFormObject(req, res)
    const flowUpdateCiagPlanRequest = new FlowUpdateCiagPlanRequest(updatedFormObject, plan)
    const dto = toCreateOrUpdateInductionDto(flowUpdateCiagPlanRequest)
    await this.inductionService.updateInduction(id, dto, res.locals.user.token)

    deleteSessionData(req, ['isUpdateFlow', id])
    deleteSessionData(req, ['createPlan', id])
    deleteSessionData(req, ['changeStatus', id])
  }

  private async createNewInduction(req: Request, res: Response) {
    const { id } = req.params
    const createInductionDto = toCreateOrUpdateInductionDto(newInduction(req))
    await this.inductionService.createInduction(id, createInductionDto, res.locals.user.token)

    // Tidy up record in session
    deleteSessionData(req, ['createPlan', id])
    deleteSessionData(req, ['changeStatus', id])
  }
}

const newInduction = (req: Request): CiagPlan => {
  const { id } = req.params
  const { prisoner } = req.context
  const record = getSessionData(req, ['createPlan', id])
  return {
    offenderId: id,
    desireToWork: record.hopingToWork === YesNoValue.YES,
    hopingToGetWork: record.hopingToGetWork,
    reasonToNotGetWork: record.reasonToNotGetWork,
    reasonToNotGetWorkOther: record.reasonToNotGetWorkOther,
    abilityToWork: record.abilityToWork,
    abilityToWorkOther: record.abilityToWorkOther,
    workExperience: record.hasWorkedBefore
      ? {
          hasWorkedBefore: record.hasWorkedBefore === YesNoValue.YES,
          typeOfWorkExperience: record.typeOfWorkExperience,
          typeOfWorkExperienceOther: record.typeOfWorkExperienceOther,
          workExperience: record.workExperience,
          modifiedBy: undefined,
          modifiedDateTime: undefined,
          workInterests: {
            workInterests: record.workInterests,
            workInterestsOther: record.workInterestsOther,
            particularJobInterests: record.particularJobInterests,
            modifiedBy: undefined,
            modifiedDateTime: undefined,
          },
        }
      : undefined,
    skillsAndInterests:
      record.skills && record.personalInterests
        ? {
            skills: record.skills,
            skillsOther: record.skillsOther,
            personalInterests: record.personalInterests,
            personalInterestsOther: record.personalInterestsOther,
            modifiedBy: undefined,
            modifiedDateTime: undefined,
          }
        : undefined,
    qualificationsAndTraining: {
      educationLevel: record.educationLevel,
      qualifications: record.qualifications,
      additionalTraining: record.additionalTraining,
      additionalTrainingOther: record.additionalTrainingOther,
      modifiedBy: undefined,
      modifiedDateTime: undefined,
    },
    inPrisonInterests:
      record.inPrisonWork && record.inPrisonEducation
        ? {
            inPrisonWork: record.inPrisonWork,
            inPrisonWorkOther: record.inPrisonWorkOther,
            inPrisonEducation: record.inPrisonEducation,
            inPrisonEducationOther: record.inPrisonEducationOther,
            modifiedBy: undefined,
            modifiedDateTime: undefined,
          }
        : undefined,
    prisonId: prisoner.prisonId,
    createdBy: undefined,
    createdDateTime: undefined,
    modifiedBy: undefined,
    modifiedDateTime: undefined,
  }
}

const getInductionFormObject = (req: Request, res: Response) => {
  const { id } = req.params
  const { prisoner } = req.context
  const record = getSessionData(req, ['createPlan', id])

  return {
    prisonerId: id,
    bookingId: prisoner.bookingId,
    currentUser: res.locals.user.username,
    hopingToGetWork: record.hopingToGetWork,
    reasonToNotGetWork: record.reasonToNotGetWork,
    reasonToNotGetWorkOther: record.reasonToNotGetWorkOther,
    abilityToWork: record.abilityToWork,
    abilityToWorkOther: record.abilityToWorkOther,
    hasWorkedBefore: record.hasWorkedBefore,
    typeOfWorkExperience: record.typeOfWorkExperience,
    typeOfWorkExperienceOther: record.typeOfWorkExperienceOther,
    workExperience: record.workExperience,
    workInterests: record.workInterests,
    workInterestsOther: record.workInterestsOther,
    particularJobInterests: record.particularJobInterests,
    skills: record.skills,
    skillsOther: record.skillsOther,
    personalInterests: record.personalInterests,
    personalInterestsOther: record.personalInterestsOther,
    educationLevel: record.educationLevel,
    qualifications: record.qualifications,
    additionalTraining: record.additionalTraining,
    additionalTrainingOther: record.additionalTrainingOther,
    inPrisonWork: record.inPrisonWork,
    inPrisonWorkOther: record.inPrisonWorkOther,
    inPrisonEducation: record.inPrisonEducation,
    inPrisonEducationOther: record.inPrisonEducationOther,
    prisonId: prisoner.prisonId,
  }
}
