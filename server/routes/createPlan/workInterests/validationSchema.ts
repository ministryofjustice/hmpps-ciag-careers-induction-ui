import joi from 'joi'
import type { ObjectSchema } from 'joi'

import WorkInterestsValue from '../../../enums/workInterestsValue'

interface WorkInterestsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: WorkInterestsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of work ${firstName} ${lastName} is interested in`
  const msgOther = `Enter the type of work ${firstName} ${lastName} is interested in`

  return joi
    .object({
      workInterestsOther: joi.string().allow(''),
      workInterests: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              WorkInterestsValue.OUTDOOR,
              WorkInterestsValue.CONSTRUCTION,
              WorkInterestsValue.DRIVING,
              WorkInterestsValue.BEAUTY,
              WorkInterestsValue.HOSPITALITY,
              WorkInterestsValue.TECHNICAL,
              WorkInterestsValue.MANUFACTURING,
              WorkInterestsValue.OFFICE,
              WorkInterestsValue.RETAIL,
              WorkInterestsValue.SPORTS,
              WorkInterestsValue.WAREHOUSING,
              WorkInterestsValue.WASTE_MANAGEMENT,
              WorkInterestsValue.EDUCATION_TRAINING,
              WorkInterestsValue.OTHER,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { workInterestsOther, workInterests } = obj

      if (!workInterests.includes('OTHER')) {
        return true
      }

      if (!workInterestsOther) {
        return helper.error('any.custom', {
          key: 'workInterestsOther',
          label: 'workInterestsOther',
        })
      }

      if (workInterestsOther.length > 200) {
        return helper.error('any.length', {
          key: 'workInterestsOther',
          label: 'workInterestsOther',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Type of work interest must be 200 characters or less',
    })
}
