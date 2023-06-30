import joi from 'joi'
import type { ObjectSchema } from 'joi'

import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

interface TypeOfWorkExperienceData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: TypeOfWorkExperienceData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of work ${firstName} ${lastName} has done before`
  const msgOther = `Enter the type of work ${firstName} ${lastName} has done before`

  return joi
    .object({
      typeOfWorkExperienceDetails: joi.string().allow(''),
      typeOfWorkExperience: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              TypeOfWorkExperienceValue.OUTDOOR,
              TypeOfWorkExperienceValue.CONSTRUCTION,
              TypeOfWorkExperienceValue.DRIVING,
              TypeOfWorkExperienceValue.BEAUTY,
              TypeOfWorkExperienceValue.HOSPITALITY,
              TypeOfWorkExperienceValue.TECHNICAL,
              TypeOfWorkExperienceValue.MANUFACTURING,
              TypeOfWorkExperienceValue.OFFICE,
              TypeOfWorkExperienceValue.RETAIL,
              TypeOfWorkExperienceValue.SPORTS,
              TypeOfWorkExperienceValue.WAREHOUSING,
              TypeOfWorkExperienceValue.WASTE_MANAGEMENT,
              TypeOfWorkExperienceValue.EDUCATION_TRAINING,
              TypeOfWorkExperienceValue.OTHER,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { typeOfWorkExperienceDetails, typeOfWorkExperience } = obj

      if (!typeOfWorkExperience.includes('OTHER')) {
        return true
      }

      if (!typeOfWorkExperienceDetails) {
        return helper.error('any.custom', {
          key: 'typeOfWorkExperienceDetails',
          label: 'typeOfWorkExperienceDetails',
        })
      }

      if (typeOfWorkExperienceDetails.length > 200) {
        return helper.error('any.length', {
          key: 'typeOfWorkExperienceDetails',
          label: 'typeOfWorkExperienceDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Type of work experience must be 200 characters or less',
    })
}
