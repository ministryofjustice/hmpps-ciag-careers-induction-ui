import { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import CiagService from '../../../services/ciagService'
import FlowUpdateCiagPlanRequest from '../../../data/ciagApi/models/flowUpdateCiagPlanRequest'

export default class CheckYourAnswersController {
  constructor(private readonly ciagService: CiagService) {}

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

      await this.ciagService.createCiagPlan(res.locals.user.token, id, newRecord)

      // Tidy up record in session
      deleteSessionData(req, ['createPlan', id])
      deleteSessionData(req, ['changeStatus', id])

      res.redirect(addressLookup.learningPlan.addGoals(id))
    } catch (err) {
      next(err)
    }
  }
}
