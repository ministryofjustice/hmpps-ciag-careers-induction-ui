import { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import addressLookup from '../../addressLookup'
import config from '../../../config'
import { deleteSessionData, getSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import CiagService from '../../../services/ciagService'
import FlowUpdateCiagPlanRequest from '../../../data/ciagApi/models/flowUpdateCiagPlanRequest'
import InductionService from '../../../services/inductionService'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import CiagPlan from '../../../data/ciagApi/interfaces/ciagPlan'
import YesNoValue from '../../../enums/yesNoValue'

export default class CheckYourAnswersController {
  constructor(
    private readonly ciagService: CiagService,
    private readonly inductionService: InductionService,
  ) {}

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
    const { prisoner, plan } = req.context

    try {
      const record = getSessionData(req, ['createPlan', id])
      const newCiagPlan: CiagPlan = {
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
        prisonName: prisoner.prisonName,
        createdBy: undefined,
        createdDateTime: undefined,
        modifiedBy: undefined,
        modifiedDateTime: undefined,
      }

      // TODO - RR-527 - use CiagPlan instead
      // Setup required data for api
      const newRecord = {
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
        prisonName: prisoner.prisonName,
      }

      // Handle flow update, an update when hopingToGetWork was changed
      if (getSessionData(req, ['isUpdateFlow', id])) {
        await this.ciagService.updateCiagPlan(res.locals.user.token, id, new FlowUpdateCiagPlanRequest(newRecord, plan))

        deleteSessionData(req, ['isUpdateFlow', id])
        deleteSessionData(req, ['createPlan', id])
        deleteSessionData(req, ['changeStatus', id])

        res.redirect(addressLookup.learningPlan.profile(id))
        return
      }

      if (config.featureToggles.useNewInductionApiEnabled) {
        const dto = toCreateOrUpdateInductionDto(newCiagPlan)
        await this.inductionService.createInduction(id, dto, res.locals.user.token)
      } else {
        await this.ciagService.createCiagPlan(res.locals.user.token, id, newRecord)
      }

      // Tidy up record in session
      deleteSessionData(req, ['createPlan', id])
      deleteSessionData(req, ['changeStatus', id])

      res.redirect(`${config.learningPlanUrl}/plan/${id}/induction-created`)
    } catch (err) {
      next(err)
    }
  }
}
