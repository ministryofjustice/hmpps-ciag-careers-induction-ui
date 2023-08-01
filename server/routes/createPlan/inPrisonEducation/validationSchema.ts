import joi from 'joi'
import type { ObjectSchema } from 'joi'

import InPrisonEducationValue from '../../../enums/inPrisonEducationValue'

interface InPrisonEducationData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: InPrisonEducationData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of training ${firstName} ${lastName} would like to do in prison`
  const msgOther = `Enter the type of type of training ${firstName} ${lastName} would like to do in prison`

  return joi
    .object({
      inPrisonEducationDetails: joi.string().allow(''),
      inPrisonEducation: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              InPrisonEducationValue.BARBERING_AND_HAIRDRESSING,
              InPrisonEducationValue.CATERING,
              InPrisonEducationValue.COMMUNICATION_SKILLS,
              InPrisonEducationValue.ENGLISH_LANGUAGE_SKILLS,
              InPrisonEducationValue.FORKLIFT_DRIVING,
              InPrisonEducationValue.INTERVIEW_SKILLS,
              InPrisonEducationValue.MACHINERY_TICKETS,
              InPrisonEducationValue.NUMERACY_SKILLS,
              InPrisonEducationValue.RUNNING_A_BUSINESS,
              InPrisonEducationValue.SOCIAL_AND_LIFE_SKILLS,
              InPrisonEducationValue.WELDING_AND_METALWORK,
              InPrisonEducationValue.WOODWORK_AND_JOINERY,
              InPrisonEducationValue.OTHER,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { inPrisonEducationDetails, inPrisonEducation } = obj

      if (!inPrisonEducation.includes('OTHER')) {
        return true
      }

      if (!inPrisonEducationDetails) {
        return helper.error('any.custom', {
          key: 'inPrisonEducationDetails',
          label: 'inPrisonEducationDetails',
        })
      }

      if (inPrisonEducationDetails.length > 200) {
        return helper.error('any.length', {
          key: 'inPrisonEducationDetails',
          label: 'inPrisonEducationDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Training in prison must be 200 characters or less',
    })
}
