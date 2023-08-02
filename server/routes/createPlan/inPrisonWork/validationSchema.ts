import joi from 'joi'
import type { ObjectSchema } from 'joi'

import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'

interface InPrisonWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: InPrisonWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of work ${firstName} ${lastName} would like to do in prison`
  const msgOther = `Enter the type of work ${firstName} ${lastName} would like to do in prison`

  return joi
    .object({
      inPrisonWorkOther: joi.string().allow(''),
      inPrisonWork: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              InPrisonWorkValue.CLEANING_AND_HYGIENE,
              InPrisonWorkValue.COMPUTERS_OR_DESK_BASED,
              InPrisonWorkValue.GARDENING_AND_OUTDOORS,
              InPrisonWorkValue.KITCHENS_AND_COOKING,
              InPrisonWorkValue.MAINTENANCE,
              InPrisonWorkValue.PRISON_LAUNDRY,
              InPrisonWorkValue.PRISON_LIBRARY,
              InPrisonWorkValue.TEXTILES_AND_SEWING,
              InPrisonWorkValue.WELDING_AND_METALWORK,
              InPrisonWorkValue.WOODWORK_AND_JOINERY,
              InPrisonWorkValue.OTHER,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { inPrisonWorkOther, inPrisonWork } = obj

      if (!inPrisonWork.includes('OTHER')) {
        return true
      }

      if (!inPrisonWorkOther) {
        return helper.error('any.custom', {
          key: 'inPrisonWorkOther',
          label: 'inPrisonWorkOther',
        })
      }

      if (inPrisonWorkOther.length > 200) {
        return helper.error('any.length', {
          key: 'inPrisonWorkOther',
          label: 'inPrisonWorkOther',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Type of work experience must be 200 characters or less',
    })
}
