import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    searchTerm: joi.string().allow('').max(200).messages({
      'string.max': 'Search term must be 200 characters or less',
    }),
  })
}
