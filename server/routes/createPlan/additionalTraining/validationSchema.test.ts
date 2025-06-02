import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'
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
      path: ['additionalTraining'],
      type: 'any.required',
      context: {
        key: 'additionalTraining',
        label: 'additionalTraining',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.additionalTraining = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'additionalTraining[0]',
        valids: [
          AdditionalTrainingValue.CSCS_CARD,
          AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE,
          AdditionalTrainingValue.FIRST_AID_CERTIFICATE,
          AdditionalTrainingValue.FOOD_HYGIENE_CERTIFICATE,
          AdditionalTrainingValue.HEALTH_AND_SAFETY,
          AdditionalTrainingValue.HGV_LICENCE,
          AdditionalTrainingValue.MACHINERY_TICKETS,
          AdditionalTrainingValue.MANUAL_HANDLING,
          AdditionalTrainingValue.TRADE_COURSE,
          AdditionalTrainingValue.OTHER,
          AdditionalTrainingValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of training or vocational qualification mock_firstName mock_lastName has',
      path: ['additionalTraining', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.additionalTraining = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'additionalTrainingOther',
        label: 'value',
        value: {
          additionalTraining: ['OTHER'],
        },
      },
      message: 'Enter the type of training or vocational qualification mock_firstName mock_lastName has',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.additionalTraining = ['OTHER']
    req.body.additionalTrainingOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'additionalTrainingOther',
        label: 'value',
        value: {
          additionalTrainingOther: longStr,
          additionalTraining: ['OTHER'],
        },
      },
      message: 'Other qualification must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.additionalTraining = ['MACHINERY_TICKETS']
    req.body.additionalTrainingOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.additionalTraining = ['OTHER']
    req.body.additionalTrainingOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
