import joi from 'joi'
import type { ObjectSchema } from 'joi'

import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'

interface AdditionalTrainingData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: AdditionalTrainingData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of training or vocational qualification ${firstName} ${lastName} has`
  const msgOther = `Enter the type of training or vocational qualification ${firstName} ${lastName} has`

  return joi
    .object({
      additionalTrainingOther: joi.string().allow(''),
      additionalTraining: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              AdditionalTrainingValue.CSCS_CARD,
              AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE,
              AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
              AdditionalTrainingValue.FOOD_HYGIENE_CERTIFICATE,
              AdditionalTrainingValue.HEALTH_AND_SAFETY,
              AdditionalTrainingValue.HGV_LICENSE,
              AdditionalTrainingValue.MACHINERY_TICKETS,
              AdditionalTrainingValue.MANUAL_HANDLING,
              AdditionalTrainingValue.TRADE_COURSE,
              AdditionalTrainingValue.OTHER,
              AdditionalTrainingValue.NONE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { additionalTrainingOther, additionalTraining } = obj

      if (!additionalTraining.includes('OTHER')) {
        return true
      }

      if (!additionalTrainingOther) {
        return helper.error('any.custom', {
          key: 'additionalTrainingOther',
          label: 'additionalTrainingOther',
        })
      }

      if (additionalTrainingOther.length > 200) {
        return helper.error('any.length', {
          key: 'additionalTrainingOther',
          label: 'additionalTrainingOther',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Other qualification must be 200 characters or less',
    })
}
