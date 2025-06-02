import joi from 'joi'
import type { ObjectSchema } from 'joi'
import WorkInterestsValue from '../../../enums/workInterestsValue'
import contentLookup from '../../../constants/contentLookup'

interface WorkDetailsData {
  workInterests: WorkInterestsValue[]
  workInterestsOther: string
}

export default function validationSchema(data: WorkDetailsData): ObjectSchema {
  const { workInterests, workInterestsOther } = data

  const schema = {}
  workInterests.forEach(key => {
    schema[key] = joi
      .string()
      .allow('')
      .max(200)
      .messages({
        'string.max':
          key === WorkInterestsValue.OTHER
            ? `${workInterestsOther} job role must be 200 characters or less`
            : `${contentLookup.fields.workInterests[key]} job role must be 200 characters or less`,
      })
  })

  return joi.object(schema)
}
