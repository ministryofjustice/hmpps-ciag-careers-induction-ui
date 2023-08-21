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
      message: 'Select whether mock_firstName mock_lastName wants to record any other educational qualifications',
      path: ['addQualificationsLite'],
      type: 'any.required',
      context: {
        key: 'addQualificationsLite',
        label: 'addQualificationsLite',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.addQualificationsLite = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'addQualificationsLite',
        label: 'addQualificationsLite',
        valids: ['YES', 'NO'],
        value: 'SOME_VALUE',
      },
      message: 'Select whether mock_firstName mock_lastName wants to record any other educational qualifications',
      path: ['addQualificationsLite'],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.addQualificationsLite = 'YES'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
