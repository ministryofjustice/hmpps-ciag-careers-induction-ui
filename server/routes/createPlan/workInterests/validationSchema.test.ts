import WorkInterestsValue from '../../../enums/workInterestsValue'
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
      message: 'Select the type of work mock_firstName mock_lastName is interested in',
      path: ['workInterests'],
      type: 'any.required',
      context: {
        key: 'workInterests',
        label: 'workInterests',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.workInterests = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'workInterests[0]',
        valids: [
          WorkInterestsValue.OUTDOOR,
          WorkInterestsValue.CONSTRUCTION,
          WorkInterestsValue.DRIVING,
          WorkInterestsValue.BEAUTY,
          WorkInterestsValue.HOSPITALITY,
          WorkInterestsValue.TECHNICAL,
          WorkInterestsValue.MANUFACTURING,
          WorkInterestsValue.OFFICE,
          WorkInterestsValue.RETAIL,
          WorkInterestsValue.SPORTS,
          WorkInterestsValue.WAREHOUSING,
          WorkInterestsValue.WASTE_MANAGEMENT,
          WorkInterestsValue.EDUCATION_TRAINING,
          WorkInterestsValue.OTHER,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of work mock_firstName mock_lastName is interested in',
      path: ['workInterests', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.workInterests = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'workInterestsOther',
        label: 'value',
        value: {
          workInterests: ['OTHER'],
        },
      },
      message: 'Enter the type of work mock_firstName mock_lastName is interested in',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.workInterests = ['OTHER']
    req.body.workInterestsOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'workInterestsOther',
        label: 'value',
        value: {
          workInterestsOther: longStr,
          workInterests: ['OTHER'],
        },
      },
      message: 'Type of work interest must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.workInterests = ['CONSTRUCTION']
    req.body.workInterestsOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.workInterests = ['OTHER']
    req.body.workInterestsOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
