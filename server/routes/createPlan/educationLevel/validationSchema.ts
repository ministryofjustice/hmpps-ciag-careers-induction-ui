import joi from 'joi'
import type { ObjectSchema } from 'joi'

import EducationLevelValue from '../../../enums/educationLevelValue'

interface EducationLevelData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: EducationLevelData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select ${firstName} ${lastName}'s highest level of education`

  return joi.object({
    educationLevel: joi
      .string()
      .required()
      .valid(
        EducationLevelValue.PRIMARY_SCHOOL,
        EducationLevelValue.SECONDARY_SCHOOL_NO_EXAMS,
        EducationLevelValue.SECONDARY_SCHOOL_EXAMS,
        EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
        EducationLevelValue.UNDERGRADUATE_DEGREE,
        EducationLevelValue.POSTGRADUATE_DEGREE,
        EducationLevelValue.NOT_SURE,
      )
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
