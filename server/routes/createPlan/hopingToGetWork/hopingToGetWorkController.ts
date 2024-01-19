import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import getHubPageByMode from '../../../utils/getHubPageByMode'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import CiagService from '../../../services/ciagService'
import uuidv4 from '../../../utils/guid'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import YesNoValue from '../../../enums/yesNoValue'

export default class HopingToGetWorkController {
  constructor(private readonly ciagService: CiagService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, plan } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createPlan', id], {})

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: mode === 'new' ? addressLookup.learningPlan.profile(id, 'overview') : getHubPageByMode(mode, id),
        page: 'hopingToGetWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        hopingToGetWork: mode === 'update' ? record.hopingToGetWork || plan.hopingToGetWork : record.hopingToGetWork,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['hopingToGetWork', id, 'data'], data)
      setSessionData(req, ['isUpdateFlow', id], false)

      res.render('pages/createPlan/hopingToGetWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { hopingToGetWork } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['hopingToGetWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/hopingToGetWork/index', {
          ...data,
          errors,
        })
        return
      }

      deleteSessionData(req, ['hopingToGetWork', id, 'data'])

      // Handle update
      if (mode === 'update') {
        this.handleUpdate(req, res)
        return
      }

      const record = getSessionData(req, ['createPlan', id], {})
      const desireToWorkExisting = record.hopingToGetWork === HopingToGetWorkValue.YES
      const desireToWorkNew = hopingToGetWork === HopingToGetWorkValue.YES

      // Handle no changes
      if (mode !== 'new' && desireToWorkExisting === desireToWorkNew) {
        // Update record in session
        setSessionData(req, ['createPlan', id], {
          ...record,
          hopingToGetWork,
        })
        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Create new record in sessionData
      setSessionData(req, ['createPlan', id], {
        hopingToGetWork,
      })

      // Redirect to the correct page based on value
      res.redirect(
        hopingToGetWork === HopingToGetWorkValue.YES
          ? addressLookup.createPlan.qualifications(id, 'new')
          : addressLookup.createPlan.reasonToNotGetWork(id, 'new'),
      )
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { plan, prisoner } = req.context
    const { hopingToGetWork } = req.body

    // Handle no flow change changes
    const desireToWork = hopingToGetWork === HopingToGetWorkValue.YES
    if (desireToWork === plan.desireToWork) {
      deleteSessionData(req, ['createPlan', id])

      // Update simple field value change
      if (hopingToGetWork !== plan.hopingToGetWork) {
        // Update data model
        const updatedPlan = {
          prisonId: prisoner.prisonId,
          ...plan,
          hopingToGetWork,
          desireToWork: hopingToGetWork === HopingToGetWorkValue.YES,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
        }

        // Call api
        await this.ciagService.updateCiagPlan(res.locals.user.token, id, new UpdateCiagPlanRequest(updatedPlan))
      }

      res.redirect(addressLookup.learningPlan.profile(id))
      return
    }

    // Handle update with full flow change
    setSessionData(req, ['isUpdateFlow', id], true)

    // Setup record with existing values
    setSessionData(req, ['createPlan', id], {
      hopingToGetWork,
      reasonToNotGetWork: plan.reasonToNotGetWork,
      reasonToNotGetWorkOther: plan.reasonToNotGetWorkOther,
      abilityToWork: plan.abilityToWork,
      abilityToWorkOther: plan.abilityToWorkOther,
      hasWorkedBefore: plan.workExperience?.hasWorkedBefore,
      typeOfWorkExperience: plan.workExperience?.typeOfWorkExperience,
      typeOfWorkExperienceOther: plan.workExperience?.typeOfWorkExperienceOther,
      workExperience: plan.workExperience?.workExperience,
      workInterests: plan.workExperience?.workInterests?.workInterests,
      workInterestsOther: plan.workExperience?.workInterests?.workInterestsOther,
      particularJobInterests: plan.workExperience?.workInterests?.particularJobInterests,
      skills: plan.skillsAndInterests?.skills,
      skillsOther: plan.skillsAndInterests?.skillsOther,
      personalInterests: plan.skillsAndInterests?.personalInterests,
      personalInterestsOther: plan.skillsAndInterests?.personalInterestsOther,
      educationLevel: plan.qualificationsAndTraining?.educationLevel,
      qualifications: (plan.qualificationsAndTraining?.qualifications || []).map(
        (q: { subject: string; grade: string; level: QualificationLevelValue }) => ({
          ...q,
          id: uuidv4(),
        }),
      ),
      wantsToAddQualifications:
        (plan.qualificationsAndTraining?.qualifications || []).length > 0 ? YesNoValue.YES : YesNoValue.NO,
      additionalTraining: plan.qualificationsAndTraining?.additionalTraining,
      additionalTrainingOther: plan.qualificationsAndTraining?.additionalTrainingOther,
      inPrisonWork: plan.inPrisonInterests?.inPrisonWork,
      inPrisonWorkOther: plan.inPrisonInterests?.inPrisonWorkOther,
      inPrisonEducation: plan.inPrisonInterests?.inPrisonEducation,
      inPrisonEducationOther: plan.inPrisonInterests?.inPrisonEducationOther,
    })

    // Redirect to the correct page based on value
    res.redirect(
      hopingToGetWork === HopingToGetWorkValue.YES
        ? `${addressLookup.createPlan.qualifications(id, 'new')}?from=${encryptUrlParameter(req.originalUrl)}`
        : `${addressLookup.createPlan.reasonToNotGetWork(id, 'new')}?from=${encryptUrlParameter(req.originalUrl)}`,
    )
  }
}
