import joi from 'joi'
import type { ObjectSchema } from 'joi'

import YesNoValue from '../../../enums/yesNoValue'

interface AddQualificationsLiteData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: AddQualificationsLiteData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select whether ${firstName} ${lastName} wants to record any other educational qualifications`

  return joi.object({
    addQualificationsLite: joi.string().required().valid(YesNoValue.YES, YesNoValue.NO).messages({
      'any.only': msg,
      'any.required': msg,
    }),
  })
}
