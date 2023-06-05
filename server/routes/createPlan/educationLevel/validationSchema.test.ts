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
        valids: [
          'PRIMARY_SCHOOL',
          'SECONDARY_SCHOOL_NO_EXAMS',
          'SECONDARY_SCHOOL_EXAMS',
          'FURTHER_EDUCATION_COLLEGE',
          'UNDERGRADUATE_DEGREE',
          'POSTGRADUATE_DEGREE',
          'NOT_SURE',
        ],
        value: 'SOME_VALUE',
      },
      message: "Select mock_firstName mock_lastName's highest level of education",
      path: ['educationLevel'],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.educationLevel = 'PRIMARY_SCHOOL'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
