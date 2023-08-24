import joi from 'joi'
import type { ObjectSchema } from 'joi'

import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'

interface ReasonToNotGetWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: ReasonToNotGetWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select why ${firstName} ${lastName} is not hoping to get work`
  const msgOther = `Enter why ${firstName} ${lastName} is not hoping to get work when they're released`

  const schema = joi
    .object({
      reasonToNotGetWorkOther: joi.string().allow(''),
      reasonToNotGetWork: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              ReasonToNotGetWorkValue.LIMIT_THEIR_ABILITY,
              ReasonToNotGetWorkValue.HEALTH,
              ReasonToNotGetWorkValue.FULL_TIME_CARER,
              ReasonToNotGetWorkValue.LACKS_CONFIDENCE_OR_MOTIVATION,
              ReasonToNotGetWorkValue.NO_REASON,
              ReasonToNotGetWorkValue.NO_RIGHT_TO_WORK,
              ReasonToNotGetWorkValue.RETIRED,
              ReasonToNotGetWorkValue.OTHER,
              ReasonToNotGetWorkValue.NOT_SURE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { reasonToNotGetWorkOther, reasonToNotGetWork } = obj

      if (!reasonToNotGetWork.includes('OTHER')) {
        return true
      }

      if (!reasonToNotGetWorkOther) {
        return helper.error('any.custom', {
          key: 'reasonToNotGetWorkOther',
          label: 'reasonToNotGetWorkOther',
        })
      }

      if (reasonToNotGetWorkOther.length > 200) {
        return helper.error('any.length', {
          key: 'reasonToNotGetWorkOther',
          label: 'reasonToNotGetWorkOther',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Reason must be 200 characters or less',
    })

  return schema
}
