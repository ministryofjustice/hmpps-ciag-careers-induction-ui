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
      message: "Select mock_firstName mock_lastName's highest level of education",
      path: ['hasWorkedBefore'],
      type: 'any.required',
      context: {
        key: 'hasWorkedBefore',
        label: 'hasWorkedBefore',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.hasWorkedBefore = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'hasWorkedBefore',
        label: 'hasWorkedBefore',
        valids: ['YES', 'NO'],
        value: 'SOME_VALUE',
      },
      message: "Select mock_firstName mock_lastName's highest level of education",
      path: ['hasWorkedBefore'],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.hasWorkedBefore = 'YES'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
