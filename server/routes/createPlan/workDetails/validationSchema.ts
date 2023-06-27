import joi from 'joi'
import type { ObjectSchema } from 'joi'

interface WorkDetailsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: WorkDetailsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  return joi.object({
    jobRole: joi
      .string()
      .required()
      .max(200)
      .messages({
        'any.required': `Enter the job role ${firstName} ${lastName} wants to add`,
        'string.empty': `Enter the job role ${firstName} ${lastName} wants to add`,
        'string.max': 'Job role must be 200 characters or less',
      }),
    jobDetails: joi
      .string()
      .required()
      .max(4000)
      .messages({
        'any.required': `Enter details of what ${firstName} ${lastName} did in their job`,
        'string.empty': `Enter details of what ${firstName} ${lastName} did in their job`,
        'string.max': 'Main tasks and responsibilities must be 4000 characters or less',
      }),
  })
}
