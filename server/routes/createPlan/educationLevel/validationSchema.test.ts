import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const mockData = {
    prisoner: {
      firstName: 'mock_firstName',
      lastName: 'mock_lastName',
    },
  }

  const schema = validationSchema(mockData)

  it('On validation error - Required - Returns the correct error message', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select if mock_firstName mock_lastName is interested in a particular job or not',
      path: ['educationLevel'],
      type: 'any.required',
      context: {
        key: 'educationLevel',
        label: 'educationLevel',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.educationLevel = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'educationLevel',
        label: 'educationLevel',
        valids: ['YES', 'NO'],
        value: 'SOME_VALUE',
      },
      message: 'Select if mock_firstName mock_lastName is interested in a particular job or not',
      path: ['educationLevel'],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.educationLevel = 'NO'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - YES - Returns no errors', () => {
    req.body.educationLevel = 'YES'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
