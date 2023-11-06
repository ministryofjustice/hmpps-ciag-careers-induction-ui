import ReasonToNotGetWorkValue from '../../../enums/reasonToNotGetWorkValue'
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
      message: 'Select what could stop mock_firstName mock_lastName working when they are released',
      path: ['reasonToNotGetWork'],
      type: 'any.required',
      context: {
        key: 'reasonToNotGetWork',
        label: 'reasonToNotGetWork',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.reasonToNotGetWork = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'reasonToNotGetWork[0]',
        valids: [
          ReasonToNotGetWorkValue.LIMIT_THEIR_ABILITY,
          ReasonToNotGetWorkValue.HEALTH,
          ReasonToNotGetWorkValue.FULL_TIME_CARER,
          ReasonToNotGetWorkValue.LACKS_CONFIDENCE_OR_MOTIVATION,
          ReasonToNotGetWorkValue.NO_REASON,
          ReasonToNotGetWorkValue.NO_RIGHT_TO_WORK,
          ReasonToNotGetWorkValue.RETIRED,
          ReasonToNotGetWorkValue.OTHER,
          ReasonToNotGetWorkValue.NOT_SURE,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select what could stop mock_firstName mock_lastName working when they are released',
      path: ['reasonToNotGetWork', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.reasonToNotGetWork = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'reasonToNotGetWorkOther',
        label: 'value',
        value: {
          reasonToNotGetWork: ['OTHER'],
        },
      },
      message: 'Enter what could stop mock_firstName mock_lastName working when they are released',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.reasonToNotGetWork = ['OTHER']
    req.body.reasonToNotGetWorkOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'reasonToNotGetWorkOther',
        label: 'value',
        value: {
          reasonToNotGetWorkOther: longStr,
          reasonToNotGetWork: ['OTHER'],
        },
      },
      message: 'Reason must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.reasonToNotGetWork = ['LIMIT_THEIR_ABILITY']
    req.body.reasonToNotGetWorkOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.reasonToNotGetWork = ['OTHER']
    req.body.reasonToNotGetWorkOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
