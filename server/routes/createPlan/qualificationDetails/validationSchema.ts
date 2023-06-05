import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    qualificationSubject: joi.string().required().max(4000).messages({
      'any.required': 'Qualification subject is required',
      'string.empty': 'Qualification subject is required',
      'string.max': 'Qualification subject must be 200 characters or less',
    }),
    qualificationGrade: joi.string().required().max(4000).messages({
      'any.required': 'Qualification grade is required',
      'string.empty': 'Qualification grade is required',
      'string.max': 'Qualification grade must be 200 characters or less',
    }),
  })
}
