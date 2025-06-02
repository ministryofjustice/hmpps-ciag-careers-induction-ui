import joi from 'joi'
import type { ObjectSchema } from 'joi'

import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

interface HopingToGetWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: HopingToGetWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select whether ${firstName} ${lastName} is hoping to get work`

  return joi.object({
    hopingToGetWork: joi
      .string()
      .valid(HopingToGetWorkValue.YES, HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE)
      .required()
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
