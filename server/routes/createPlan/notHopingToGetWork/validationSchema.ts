import joi from 'joi'
import type { ObjectSchema } from 'joi'

import NotHopingToGetWorkValues from '../../../enums/notHopingToGetWorkValues'

interface NotHopingToGetWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: NotHopingToGetWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select why ${firstName} ${lastName} is not hoping to get work`
  const msgOther = `Enter why ${firstName} ${lastName} is not hoping to get work when they’re released`

  const schema = joi
    .object({
      notHopingToGetWorkDetails: joi.string().allow(''),
      notHopingToGetWork: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              NotHopingToGetWorkValues.FEELS_OFFENCE_WILL_LIMIT_ABILITY_TO_WORK,
              NotHopingToGetWorkValues.NOT_ABLE_TO_WORK_DUE_TO_ILL_HEALTH,
              NotHopingToGetWorkValues.HAS_FULL_TIME_CARING_RESPONSIBILITIES,
              NotHopingToGetWorkValues.LACKS_CONFIDENCE_OR_MOTIVATION,
              NotHopingToGetWorkValues.REFUSED_SUPPORT_WITH_NO_REASON,
              NotHopingToGetWorkValues.RIGHT_TO_WORK_IN_UK_NOT_CONFIRMED,
              NotHopingToGetWorkValues.RETIRED,
              NotHopingToGetWorkValues.OTHER,
              NotHopingToGetWorkValues.NOT_SURE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { notHopingToGetWorkDetails, notHopingToGetWork } = obj

      if (!notHopingToGetWork.includes('OTHER')) {
        return true
      }

      if (!notHopingToGetWorkDetails) {
        return helper.error('any.custom', {
          key: 'notHopingToGetWorkDetails',
          label: 'notHopingToGetWorkDetails',
        })
      }

      if (notHopingToGetWorkDetails.length > 200) {
        return helper.error('any.length', {
          key: 'notHopingToGetWorkDetails',
          label: 'notHopingToGetWorkDetails',
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
