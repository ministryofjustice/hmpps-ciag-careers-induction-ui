import joi from 'joi'
import type { ObjectSchema } from 'joi'

import SkillsValue from '../../../enums/skillsValue'

interface SkillsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: SkillsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of training or vocational qualification ${firstName} ${lastName} has`
  const msgOther = `Enter the type of training or vocational qualification ${firstName} ${lastName} has`

  return joi
    .object({
      skillsDetails: joi.string().allow(''),
      skills: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              SkillsValue.CSCS,
              SkillsValue.DRIVING_LICENSE,
              SkillsValue.FIRST_AID,
              SkillsValue.FOOD_HYGIENE,
              SkillsValue.HEALTH_AND_SAFETY,
              SkillsValue.HGV_LICENSE,
              SkillsValue.MACHINERY,
              SkillsValue.MANUAL,
              SkillsValue.TRADE,
              SkillsValue.OTHER,
              SkillsValue.NONE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { skillsDetails, skills } = obj

      if (!skills.includes('OTHER')) {
        return true
      }

      if (!skillsDetails) {
        return helper.error('any.custom', {
          key: 'skillsDetails',
          label: 'skillsDetails',
        })
      }

      if (skillsDetails.length > 200) {
        return helper.error('any.length', {
          key: 'skillsDetails',
          label: 'skillsDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Other qualification must be 200 characters or less',
    })
}
