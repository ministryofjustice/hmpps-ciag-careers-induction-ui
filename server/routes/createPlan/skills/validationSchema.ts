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

  const msg = `Select the skill that ${firstName} ${lastName} feels they have or select 'None of these'`
  const msgOther = `Enter the skill that ${firstName} ${lastName} feels they have`

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
              SkillsValue.COMMUNICATION,
              SkillsValue.POSITIVE_ATTITUDE,
              SkillsValue.RESILIENCE,
              SkillsValue.SELF_MANAGEMENT,
              SkillsValue.TEAMWORK,
              SkillsValue.THINKING_PROBLEM_SOLVING,
              SkillsValue.WILLINGNESS_TO_LEARN,
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
      'any.length': 'Skill must be 200 characters or less',
    })
}
