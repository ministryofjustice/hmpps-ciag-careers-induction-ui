import joi from 'joi'
import type { ObjectSchema } from 'joi'

import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

interface AbilityToWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: AbilityToWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select whether ${firstName} ${lastName} feels something may affect their ability to work`
  const msgOther = `Enter what ${firstName} ${lastName} feels may affect their ability to work`

  return joi
    .object({
      abilityToWorkDetails: joi.string().allow(''),
      abilityToWork: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              AbilityToWorkValue.LIMITED_BY_OFFENSE,
              AbilityToWorkValue.CARING_RESPONSIBILITIES,
              AbilityToWorkValue.HEALTH_ISSUES,
              AbilityToWorkValue.NO_RIGHT_TO_WORK,
              AbilityToWorkValue.OTHER,
              AbilityToWorkValue.NONE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { abilityToWorkDetails, abilityToWork } = obj

      if (!abilityToWork.includes('OTHER')) {
        return true
      }

      if (!abilityToWorkDetails) {
        return helper.error('any.custom', {
          key: 'abilityToWorkDetails',
          label: 'abilityToWorkDetails',
        })
      }

      if (abilityToWorkDetails.length > 200) {
        return helper.error('any.length', {
          key: 'abilityToWorkDetails',
          label: 'abilityToWorkDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Reason must be 200 characters or less',
    })
}
