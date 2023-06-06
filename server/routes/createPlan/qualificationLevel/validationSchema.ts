import joi from 'joi'
import type { ObjectSchema } from 'joi'

import QualificationLevelValue from '../../../enums/qualificationLevelValue'

interface QualificationLevelData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: QualificationLevelData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the level of qualification ${firstName} ${lastName} wants to add`

  return joi.object({
    qualificationLevelDetails: joi.string().allow(''),
    qualificationLevel: joi
      .string()
      .required()
      .valid(
        QualificationLevelValue.ENTRY_LEVEL,
        QualificationLevelValue.LEVEL_1,
        QualificationLevelValue.LEVEL_2,
        QualificationLevelValue.LEVEL_3,
        QualificationLevelValue.LEVEL_4,
        QualificationLevelValue.LEVEL_5,
      )
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
