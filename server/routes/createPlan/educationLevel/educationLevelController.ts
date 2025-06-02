/* eslint-disable no-nested-ternary */
import type { RequestHandler, Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'
import EducationLevelValue from '../../../enums/educationLevelValue'
import uuidv4 from '../../../utils/guid'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import UpdateCiagPlanRequest from '../../../data/ciagApi/models/updateCiagPlanRequest'
import { getValueSafely } from '../../../utils'
import { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode } from '../../routeModes'
import { InductionService } from '../../../services'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'

export default class EducationLevelController {
  constructor(private readonly inductionService: InductionService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { prisoner, plan } = req.context

    try {
      // If no record return to hopeToGetWork
      const record = getSessionData(req, ['createPlan', id])
      if (!plan && !record) {
        res.redirect(addressLookup.createPlan.hopingToGetWork(id))
        return
      }

      // Setup back location
      const backLocation = isCreateMode(mode)
        ? addressLookup.createPlan.qualifications(id)
        : getHubPageByMode(mode, id, 'education-and-training')
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        educationLevel: isUpdateMode(mode)
          ? getValueSafely(plan, 'qualificationsAndTraining.educationLevel')
          : record.educationLevel,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['educationLevel', id, 'data'], data)

      res.render('pages/createPlan/educationLevel/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const mode: Mode = req.params.mode as Mode
    const { educationLevel } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['educationLevel', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createPlan/educationLevel/index', {
          ...data,
          errors,
          educationLevel,
        })
        return
      }

      deleteSessionData(req, ['educationLevel', id, 'data'])

      // Handle update
      if (isUpdateMode(mode)) {
        this.handleUpdate(req, res)
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createPlan', id])

      // If edit and existing qualifications, goto checkYourAnswers
      if (isEditMode(mode) && (record.qualifications || []).length) {
        setSessionData(req, ['createPlan', id], {
          ...record,
          educationLevel,
        })

        res.redirect(addressLookup.createPlan.checkYourAnswers(id))
        return
      }

      // Handle higher qualifications
      if (
        [
          EducationLevelValue.UNDERGRADUATE_DEGREE_AT_UNIVERSITY,
          EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY,
        ].includes(educationLevel)
      ) {
        const newid = uuidv4()
        // Handle qualifications collection
        setSessionData(req, ['createPlan', id], {
          ...record,
          educationLevel,
          qualifications: [
            {
              id: newid,
              level:
                educationLevel === EducationLevelValue.POSTGRADUATE_DEGREE_AT_UNIVERSITY
                  ? QualificationLevelValue.LEVEL_8
                  : QualificationLevelValue.LEVEL_6,
            },
          ],
        })

        res.redirect(
          `${addressLookup.createPlan.qualificationDetails(id, newid, mode)}?from=${encryptUrlParameter(
            req.originalUrl,
          )}`,
        )
        return
      }

      // Handle  qualifications collection
      setSessionData(req, ['createPlan', id], {
        ...record,
        educationLevel,
        qualifications: [],
      })

      // Handle secondary qualifications
      if (
        [EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS, EducationLevelValue.FURTHER_EDUCATION_COLLEGE].includes(
          educationLevel,
        )
      ) {
        res.redirect(
          `${addressLookup.createPlan.qualificationLevel(id, uuidv4(), mode)}?from=${encryptUrlParameter(
            req.originalUrl,
          )}`,
        )
        return
      }

      // Default no qualifications
      res.redirect(
        isEditMode(mode)
          ? addressLookup.createPlan.checkYourAnswers(id)
          : `${addressLookup.createPlan.additionalTraining(id)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
    } catch (err) {
      next(err)
    }
  }

  private handleUpdate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { educationLevel } = req.body
    const { plan, prisoner } = req.context

    // Update data model
    const updatedPlan = {
      ...plan,
      prisonId: prisoner.prisonId,
      qualificationsAndTraining: {
        ...plan.qualificationsAndTraining,
        educationLevel,
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      },
    }

    // Call api
    const updateCiagPlanRequest = new UpdateCiagPlanRequest(updatedPlan)
    const dto = toCreateOrUpdateInductionDto(updateCiagPlanRequest)
    await this.inductionService.updateInduction(id, dto, res.locals.user.token)

    // Setup temporary record for multi page add qualification flow
    setSessionData(req, ['createPlan', id], {
      qualifications: getValueSafely(plan, 'qualificationsAndTraining.qualifications', []),
    })

    res.redirect(
      ![
        EducationLevelValue.NOT_SURE,
        EducationLevelValue.PRIMARY_SCHOOL,
        EducationLevelValue.SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS,
      ].includes(educationLevel) && (plan.qualificationsAndTraining.qualifications || []).length === 0
        ? `${addressLookup.createPlan.qualificationLevel(id, uuidv4(), 'update')}?from=${encryptUrlParameter(
            req.originalUrl,
          )}`
        : addressLookup.learningPlan.profile(id, 'education-and-training'),
    )
  }
}
