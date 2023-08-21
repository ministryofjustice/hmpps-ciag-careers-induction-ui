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
      path: ['wantsToAddQualifications'],
      type: 'any.required',
      context: {
        key: 'wantsToAddQualifications',
        label: 'wantsToAddQualifications',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.wantsToAddQualifications = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'wantsToAddQualifications',
        label: 'wantsToAddQualifications',
        valids: ['YES', 'NO'],
        value: 'SOME_VALUE',
      },
      message: 'Select whether mock_firstName mock_lastName wants to record any other educational qualifications',
      path: ['wantsToAddQualifications'],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.wantsToAddQualifications = 'YES'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
