import joi from 'joi'
import type { ObjectSchema } from 'joi'
import contentLookup from '../../../constants/contentLookup'

interface QualificationDetailsData {
  prisoner: { firstName: string; lastName: string }
  qualificationLevel: string
}

export default function validationSchema(data: QualificationDetailsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
    qualificationLevel,
  } = data

  return joi.object({
    qualificationSubject: joi
      .string()
      .required()
      .max(4000)
      .messages({
        'any.required': `Enter the subject of ${firstName} ${lastName}'s ${contentLookup.pages.qualificationDetails.level[qualificationLevel]} qualification`,
        'string.empty': `Enter the subject of ${firstName} ${lastName}'s ${contentLookup.pages.qualificationDetails.level[qualificationLevel]} qualification`,
        'string.max': 'Subject must be 200 characters or less',
      }),
    qualificationGrade: joi
      .string()
      .required()
      .max(4000)
      .messages({
        'any.required': `Enter the grade of ${firstName} ${lastName}'s ${contentLookup.pages.qualificationDetails.level[qualificationLevel]} qualification`,
        'string.empty': `Enter the grade of ${firstName} ${lastName}'s ${contentLookup.pages.qualificationDetails.level[qualificationLevel]} qualification`,
        'string.max': 'Grade must be 200 characters or less',
      }),
  })
}
