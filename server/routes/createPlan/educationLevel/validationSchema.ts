import joi from 'joi'
import type { ObjectSchema } from 'joi'

import YesNoValue from '../../../enums/yesNoValue'

interface EducationLevelData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: EducationLevelData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select if ${firstName} ${lastName} is interested in a particular job or not`

  return joi.object({
    educationLevelDetails: joi.string().allow(''),
    educationLevel: joi.string().required().valid(YesNoValue.YES, YesNoValue.NO).messages({
      'any.only': msg,
      'any.required': msg,
    }),
  })
}
