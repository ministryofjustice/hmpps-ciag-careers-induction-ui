import joi from 'joi'
import type { ObjectSchema } from 'joi'

import OtherQualificationsValue from '../../../enums/otherQualificationsValue'

interface OtherQualificationsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: OtherQualificationsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of training or vocational qualification ${firstName} ${lastName} has`
  const msgOther = `Enter the type of training or vocational qualification ${firstName} ${lastName} has`

  return joi
    .object({
      otherQualificationsDetails: joi.string().allow(''),
      otherQualifications: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              OtherQualificationsValue.ADVANCED_EDUCATION,
              OtherQualificationsValue.CSCS,
              OtherQualificationsValue.DRIVING_LICENSE,
              OtherQualificationsValue.FIRST_AID,
              OtherQualificationsValue.FOOD_HYGIENE,
              OtherQualificationsValue.HEALTH_AND_SAFETY,
              OtherQualificationsValue.HGV_LICENSE,
              OtherQualificationsValue.MACHINERY,
              OtherQualificationsValue.MANUAL,
              OtherQualificationsValue.TRADE,
              OtherQualificationsValue.OTHER,
              OtherQualificationsValue.NONE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { otherQualificationsDetails, otherQualifications } = obj

      if (!otherQualifications.includes('OTHER')) {
        return true
      }

      if (!otherQualificationsDetails) {
        return helper.error('any.custom', {
          key: 'otherQualificationsDetails',
          label: 'otherQualificationsDetails',
        })
      }

      if (otherQualificationsDetails.length > 200) {
        return helper.error('any.length', {
          key: 'otherQualificationsDetails',
          label: 'otherQualificationsDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Other qualification must be 200 characters or less',
    })
}
