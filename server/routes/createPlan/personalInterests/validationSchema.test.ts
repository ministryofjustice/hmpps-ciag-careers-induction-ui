import PersonalInterestsValue from '../../../enums/personalInterestsValue'
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
      path: ['personalInterests'],
      type: 'any.required',
      context: {
        key: 'personalInterests',
        label: 'personalInterests',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.personalInterests = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'personalInterests[0]',
        valids: [
          PersonalInterestsValue.COMMUNITY,
          PersonalInterestsValue.CRAFTS,
          PersonalInterestsValue.CREATIVE,
          PersonalInterestsValue.DIGITAL,
          PersonalInterestsValue.KNOWLEDGE_BASED,
          PersonalInterestsValue.MUSICAL,
          PersonalInterestsValue.OUTDOOR,
          PersonalInterestsValue.NATURE_AND_ANIMALS,
          PersonalInterestsValue.SOCIAL,
          PersonalInterestsValue.SOLO_ACTIVITIES,
          PersonalInterestsValue.SOLO_SPORTS,
          PersonalInterestsValue.TEAM_SPORTS,
          PersonalInterestsValue.WELLNESS,
          PersonalInterestsValue.OTHER,
          PersonalInterestsValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: "Select mock_firstName mock_lastName's interests or select 'None of these'",
      path: ['personalInterests', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.personalInterests = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'personalInterestsOther',
        label: 'value',
        value: {
          personalInterests: ['OTHER'],
        },
      },
      message: "Enter mock_firstName mock_lastName's interests",
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.personalInterests = ['OTHER']
    req.body.personalInterestsOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'personalInterestsOther',
        label: 'value',
        value: {
          personalInterestsOther: longStr,
          personalInterests: ['OTHER'],
        },
      },
      message: 'Interest must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.personalInterests = ['COMMUNITY']
    req.body.personalInterestsOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.personalInterests = ['OTHER']
    req.body.personalInterestsOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
