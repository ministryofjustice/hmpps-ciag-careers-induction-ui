import joi from 'joi'
import type { ObjectSchema } from 'joi'

import ReasonToNotGetWorkValues from '../../../enums/reasonToNotGetWorkValues'

interface ReasonToNotGetWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: ReasonToNotGetWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select why ${firstName} ${lastName} is not hoping to get work`
  const msgOther = `Enter why ${firstName} ${lastName} is not hoping to get work when they’re released`

  const schema = joi
    .object({
      reasonToNotGetWorkDetails: joi.string().allow(''),
      reasonToNotGetWork: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              ReasonToNotGetWorkValues.LIMIT_THEIR_ABILITY,
              ReasonToNotGetWorkValues.HEALTH,
              ReasonToNotGetWorkValues.FULL_TIME_CARER,
              ReasonToNotGetWorkValues.LACKS_CONFIDENCE_OR_MOTIVATION,
              ReasonToNotGetWorkValues.NO_REASON,
              ReasonToNotGetWorkValues.NO_RIGHT_TO_WORK,
              ReasonToNotGetWorkValues.RETIRED,
              ReasonToNotGetWorkValues.OTHER,
              ReasonToNotGetWorkValues.NOT_SURE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { reasonToNotGetWorkDetails, reasonToNotGetWork } = obj

      if (!reasonToNotGetWork.includes('OTHER')) {
        return true
      }

      if (!reasonToNotGetWorkDetails) {
        return helper.error('any.custom', {
          key: 'reasonToNotGetWorkDetails',
          label: 'reasonToNotGetWorkDetails',
        })
      }

      if (reasonToNotGetWorkDetails.length > 200) {
        return helper.error('any.length', {
          key: 'reasonToNotGetWorkDetails',
          label: 'reasonToNotGetWorkDetails',
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
