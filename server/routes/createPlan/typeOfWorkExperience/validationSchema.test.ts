import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
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
      message: 'Select the type of work mock_firstName mock_lastName has done before',
      path: ['typeOfWorkExperience'],
      type: 'any.required',
      context: {
        key: 'typeOfWorkExperience',
        label: 'typeOfWorkExperience',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.typeOfWorkExperience = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'typeOfWorkExperience[0]',
        valids: [
          TypeOfWorkExperienceValue.OUTDOOR,
          TypeOfWorkExperienceValue.CLEANING_AND_MAINTENANCE,
          TypeOfWorkExperienceValue.CONSTRUCTION,
          TypeOfWorkExperienceValue.DRIVING,
          TypeOfWorkExperienceValue.BEAUTY,
          TypeOfWorkExperienceValue.HOSPITALITY,
          TypeOfWorkExperienceValue.TECHNICAL,
          TypeOfWorkExperienceValue.MANUFACTURING,
          TypeOfWorkExperienceValue.OFFICE,
          TypeOfWorkExperienceValue.RETAIL,
          TypeOfWorkExperienceValue.SPORTS,
          TypeOfWorkExperienceValue.WAREHOUSING,
          TypeOfWorkExperienceValue.WASTE_MANAGEMENT,
          TypeOfWorkExperienceValue.EDUCATION_TRAINING,
          TypeOfWorkExperienceValue.OTHER,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of work mock_firstName mock_lastName has done before',
      path: ['typeOfWorkExperience', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.typeOfWorkExperience = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'typeOfWorkExperienceOther',
        label: 'value',
        value: {
          typeOfWorkExperience: ['OTHER'],
        },
      },
      message: 'Enter the type of work mock_firstName mock_lastName has done before',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.typeOfWorkExperience = ['OTHER']
    req.body.typeOfWorkExperienceOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'typeOfWorkExperienceOther',
        label: 'value',
        value: {
          typeOfWorkExperienceOther: longStr,
          typeOfWorkExperience: ['OTHER'],
        },
      },
      message: 'Type of work experience must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.typeOfWorkExperience = ['CONSTRUCTION']
    req.body.typeOfWorkExperienceOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.typeOfWorkExperience = ['OTHER']
    req.body.typeOfWorkExperienceOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
