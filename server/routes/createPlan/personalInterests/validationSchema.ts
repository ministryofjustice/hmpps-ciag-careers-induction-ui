import joi from 'joi'
import type { ObjectSchema } from 'joi'

import PersonalInterestsValue from '../../../enums/personalInterestsValue'

interface PersonalInterestsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: PersonalInterestsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select ${firstName} ${lastName}'s interests or select 'None of these'`
  const msgOther = `Enter ${firstName} ${lastName}'s interests`

  return joi
    .object({
      personalInterestsDetails: joi.string().allow(''),
      personalInterests: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              PersonalInterestsValue.COMMUNITY,
              PersonalInterestsValue.CRAFTS,
              PersonalInterestsValue.CREATIVE,
              PersonalInterestsValue.DIGITAL,
              PersonalInterestsValue.KNOWLEDGE_BASED,
              PersonalInterestsValue.MUSICAL,
              PersonalInterestsValue.OUTDOOR,
              PersonalInterestsValue.NATURE_AND_ANIMALS,
              PersonalInterestsValue.SOCIAL,
              PersonalInterestsValue.SOLO_ACTIVITIES,
              PersonalInterestsValue.SOLO_SPORTS,
              PersonalInterestsValue.TEAM_SPORTS,
              PersonalInterestsValue.WELLNESS,
              PersonalInterestsValue.OTHER,
              PersonalInterestsValue.NONE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { personalInterestsDetails, personalInterests } = obj

      if (!personalInterests.includes('OTHER')) {
        return true
      }

      if (!personalInterestsDetails) {
        return helper.error('any.custom', {
          key: 'personalInterestsDetails',
          label: 'personalInterestsDetails',
        })
      }

      if (personalInterestsDetails.length > 200) {
        return helper.error('any.length', {
          key: 'personalInterestsDetails',
          label: 'personalInterestsDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Interest must be 200 characters or less',
    })
}
