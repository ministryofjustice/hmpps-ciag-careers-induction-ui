import joi from 'joi'
import type { ObjectSchema } from 'joi'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import contentLookup from '../../../constants/contentLookup'

interface WorkDetailsData {
  workInterests: WorkInterestsValue[]
  workInterestsDetails: string
}

export default function validationSchema(data: WorkDetailsData): ObjectSchema {
  const { workInterests, workInterestsDetails } = data

  const schema = {}
  workInterests.forEach(key => {
    schema[key] = joi
      .string()
      .allow('')
      .max(200)
      .messages({
        'string.max':
          key === WorkInterestsValue.OTHER
            ? `${workInterestsDetails} job role must be 200 characters or less`
            : `${contentLookup.fields.workInterests[key]} job role must be 200 characters or less`,
      })
  })

  return joi.object(schema)
}
