import joi from 'joi'
import type { ObjectSchema } from 'joi'

import InterestsValue from '../../../enums/interestsValue'

interface InterestsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: InterestsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select ${firstName} ${lastName}'s interests or select 'None of these'`
  const msgOther = `Enter ${firstName} ${lastName}'s interests`

  return joi
    .object({
      interestsDetails: joi.string().allow(''),
      interests: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              InterestsValue.COMMUNITY,
              InterestsValue.CRAFTS,
              InterestsValue.CREATIVE,
              InterestsValue.DIGITAL,
              InterestsValue.KNOWLEDGE_BASED,
              InterestsValue.MUSICAL,
              InterestsValue.OUTDOOR,
              InterestsValue.NATURE_AND_ANIMALS,
              InterestsValue.SOCIAL,
              InterestsValue.SOLO_ACTIVITIES,
              InterestsValue.SOLO_SPORTS,
              InterestsValue.TEAM_SPORTS,
              InterestsValue.WELLNESS,
              InterestsValue.OTHER,
              InterestsValue.NONE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { interestsDetails, interests } = obj

      if (!interests.includes('OTHER')) {
        return true
      }

      if (!interestsDetails) {
        return helper.error('any.custom', {
          key: 'interestsDetails',
          label: 'interestsDetails',
        })
      }

      if (interestsDetails.length > 200) {
        return helper.error('any.length', {
          key: 'interestsDetails',
          label: 'interestsDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Interest must be 200 characters or less',
    })
}
