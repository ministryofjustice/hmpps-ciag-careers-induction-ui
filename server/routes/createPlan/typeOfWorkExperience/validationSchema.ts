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
      typeOfWorkExperienceOther: joi.string().allow(''),
      typeOfWorkExperience: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              TypeOfWorkExperienceValue.OUTDOOR,
              TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE,
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
      const { typeOfWorkExperienceOther, typeOfWorkExperience } = obj

      if (!typeOfWorkExperience.includes('OTHER')) {
        return true
      }

      if (!typeOfWorkExperienceOther) {
        return helper.error('any.custom', {
          key: 'typeOfWorkExperienceOther',
          label: 'typeOfWorkExperienceOther',
        })
      }

      if (typeOfWorkExperienceOther.length > 200) {
        return helper.error('any.length', {
          key: 'typeOfWorkExperienceOther',
          label: 'typeOfWorkExperienceOther',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Type of work experience must be 200 characters or less',
    })
}
