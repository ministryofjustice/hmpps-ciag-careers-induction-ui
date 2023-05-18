import type { ObjectSchema } from 'joi'
import type { Request } from 'express'

interface FormValidationErrors {
  [key: string]: { text: string; href: string }
}

export default function validateFormSchema(req: Request, schema: ObjectSchema): FormValidationErrors | undefined {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

  if (!error?.details) {
    return undefined
  }

  /* eslint-disable no-param-reassign */
  return error.details.reduce((previous, current) => {
    const { key } = current.context
    previous[key] = {
      text: current.message,
      href: `#${key}`,
    }
    return previous
  }, {})
}
