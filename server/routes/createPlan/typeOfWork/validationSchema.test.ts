import TypeOfWorkValue from '../../../enums/typeOfWorkValue'
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

  const longStr = 'x'.repeat(201)

  const schema = validationSchema(mockData)

  it('On validation error - Required - Returns the correct error message', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select the type of training or vocational qualification mock_firstName mock_lastName has',
      path: ['typeOfWork'],
      type: 'any.required',
      context: {
        key: 'typeOfWork',
        label: 'typeOfWork',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.typeOfWork = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'typeOfWork[0]',
        valids: [
          TypeOfWorkValue.OUTDOOR,
          TypeOfWorkValue.CONSTRUCTION,
          TypeOfWorkValue.DRIVING,
          TypeOfWorkValue.BEAUTY,
          TypeOfWorkValue.HOSPITALITY,
          TypeOfWorkValue.TECHNICAL,
          TypeOfWorkValue.MANUFACTURING,
          TypeOfWorkValue.OFFICE,
          TypeOfWorkValue.RETAIL,
          TypeOfWorkValue.SPORTS,
          TypeOfWorkValue.WAREHOUSING,
          TypeOfWorkValue.WASTE_MANAGEMENT,
          TypeOfWorkValue.EDUCATION_TRAINING,
          TypeOfWorkValue.OTHER,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of training or vocational qualification mock_firstName mock_lastName has',
      path: ['typeOfWork', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.typeOfWork = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'typeOfWorkDetails',
        label: 'value',
        value: {
          typeOfWork: ['OTHER'],
        },
      },
      message: 'Enter the type of training or vocational qualification mock_firstName mock_lastName has',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.typeOfWork = ['OTHER']
    req.body.typeOfWorkDetails = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'typeOfWorkDetails',
        label: 'value',
        value: {
          typeOfWorkDetails: longStr,
          typeOfWork: ['OTHER'],
        },
      },
      message: 'Other qualification must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.typeOfWork = ['CONSTRUCTION']
    req.body.typeOfWorkDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.typeOfWork = ['OTHER']
    req.body.typeOfWorkDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
