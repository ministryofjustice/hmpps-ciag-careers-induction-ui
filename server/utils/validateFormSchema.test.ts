import { Request } from 'express'
import Joi from 'joi'
import validateFormSchema from './validateFormSchema'

describe('#validateFormSchema', () => {
  let req: Request

  beforeEach(() => {
    req = { body: {} } as Request
  })

  it('should return undefined when there are no validation errors', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0).max(120).required(),
    })

    req.body = { name: 'John', age: 30 }
    const result = validateFormSchema(req, schema)
    expect(result).toBeUndefined()
  })

  it('should return validation errors when they exist', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0).max(120).required(),
    })

    req.body = { name: 'John', age: -1 }
    const result = validateFormSchema(req, schema)

    expect(result).toBeDefined()
    expect(Object.keys(result).length).toBe(1)
    expect(result.age.text).toBe('"age" must be greater than or equal to 0')
    expect(result.age.href).toBe('#age')
  })
})
