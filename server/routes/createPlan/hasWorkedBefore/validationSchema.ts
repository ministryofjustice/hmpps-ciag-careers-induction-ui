import joi from 'joi'
import type { ObjectSchema } from 'joi'

import YesNoValue from '../../../enums/yesNoValue'

interface HasWorkedBeforeData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: HasWorkedBeforeData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select ${firstName} ${lastName}'s highest level of education`

  return joi.object({
    hasWorkedBefore: joi.string().required().valid(YesNoValue.YES, YesNoValue.NO).messages({
      'any.only': msg,
      'any.required': msg,
    }),
  })
}
