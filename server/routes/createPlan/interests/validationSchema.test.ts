import InterestsValue from '../../../enums/interestsValue'
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
      message: "Select mock_firstName mock_lastName's interests or select 'None of these'",
      path: ['interests'],
      type: 'any.required',
      context: {
        key: 'interests',
        label: 'interests',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.interests = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'interests[0]',
        valids: [
          InterestsValue.COMMUNITY,
          InterestsValue.CRAFTS,
          InterestsValue.CREATIVE,
          InterestsValue.DIGITAL,
          InterestsValue.KNOWLEDGE_BASED,
          InterestsValue.MUSICAL,
          InterestsValue.OUTDOOR,
          InterestsValue.NATURE_AND_ANIMALS,
          InterestsValue.SOCIAL,
          InterestsValue.SOLO_ACTIVITIES,
          InterestsValue.SOLO_SPORTS,
          InterestsValue.TEAM_SPORTS,
          InterestsValue.WELLNESS,
          InterestsValue.OTHER,
          InterestsValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: "Select mock_firstName mock_lastName's interests or select 'None of these'",
      path: ['interests', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.interests = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'interestsDetails',
        label: 'value',
        value: {
          interests: ['OTHER'],
        },
      },
      message: "Enter mock_firstName mock_lastName's interests",
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.interests = ['OTHER']
    req.body.interestsDetails = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'interestsDetails',
        label: 'value',
        value: {
          interestsDetails: longStr,
          interests: ['OTHER'],
        },
      },
      message: 'Interest must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.interests = ['COMMUNITY']
    req.body.interestsDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.interests = ['OTHER']
    req.body.interestsDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
