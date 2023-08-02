import OtherQualificationsValue from '../../../enums/otherQualificationsValue'
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
      path: ['otherQualifications'],
      type: 'any.required',
      context: {
        key: 'otherQualifications',
        label: 'otherQualifications',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.otherQualifications = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'otherQualifications[0]',
        valids: [
          OtherQualificationsValue.CSCS,
          OtherQualificationsValue.DRIVING_LICENSE,
          OtherQualificationsValue.FIRST_AID,
          OtherQualificationsValue.FOOD_HYGIENE,
          OtherQualificationsValue.HEALTH_AND_SAFETY,
          OtherQualificationsValue.HGV_LICENSE,
          OtherQualificationsValue.MACHINERY,
          OtherQualificationsValue.MANUAL,
          OtherQualificationsValue.TRADE,
          OtherQualificationsValue.OTHER,
          OtherQualificationsValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of training or vocational qualification mock_firstName mock_lastName has',
      path: ['otherQualifications', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.otherQualifications = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'otherQualificationsOther',
        label: 'value',
        value: {
          otherQualifications: ['OTHER'],
        },
      },
      message: 'Enter the type of training or vocational qualification mock_firstName mock_lastName has',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.otherQualifications = ['OTHER']
    req.body.otherQualificationsOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'otherQualificationsOther',
        label: 'value',
        value: {
          otherQualificationsOther: longStr,
          otherQualifications: ['OTHER'],
        },
      },
      message: 'Other qualification must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.otherQualifications = ['MACHINERY']
    req.body.otherQualificationsOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.otherQualifications = ['OTHER']
    req.body.otherQualificationsOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
