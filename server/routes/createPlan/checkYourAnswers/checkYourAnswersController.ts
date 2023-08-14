import { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import CiagService from '../../../services/ciagService'

export default class CheckYourAnswersController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createPlan', id])
      if (!record || !record.hopingToGetWork) {
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
    const { prisoner } = req.context

    try {
      const record = getSessionData(req, ['createPlan', id])

      // Setup required data for api
      const newRecord = {
        prisonerId: id,
        bookingId: prisoner.bookingId,
        currentUser: res.locals.user.username,
        hopingToGetWork: record.hopingToGetWork,
        notHopingToGetWork: record.notHopingToGetWork,
        notHopingToGetWorkOther: record.notHopingToGetWorkOther,
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
      }

      await this.ciagService.createCiagPlan(res.locals.user.token, id, newRecord)

      // Tidy up record in session
      deleteSessionData(req, ['createPlan', id])
      deleteSessionData(req, ['changeStatus', id])

      res.redirect(addressLookup.prisonerSearch())
    } catch (err) {
      next(err)
    }
  }
}
