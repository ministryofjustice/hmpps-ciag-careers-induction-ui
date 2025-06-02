import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
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
      message: 'Select whether mock_firstName mock_lastName feels something may affect their ability to work',
      path: ['abilityToWork'],
      type: 'any.required',
      context: {
        key: 'abilityToWork',
        label: 'abilityToWork',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.abilityToWork = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'abilityToWork[0]',
        valids: [
          AbilityToWorkValue.LIMITED_BY_OFFENSE,
          AbilityToWorkValue.CARING_RESPONSIBILITIES,
          AbilityToWorkValue.HEALTH_ISSUES,
          AbilityToWorkValue.NO_RIGHT_TO_WORK,
          AbilityToWorkValue.OTHER,
          AbilityToWorkValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select whether mock_firstName mock_lastName feels something may affect their ability to work',
      path: ['abilityToWork', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.abilityToWork = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'abilityToWorkOther',
        label: 'value',
        value: {
          abilityToWork: ['OTHER'],
        },
      },
      message: 'Enter what mock_firstName mock_lastName feels may affect their ability to work',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.abilityToWork = ['OTHER']
    req.body.abilityToWorkOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'abilityToWorkOther',
        label: 'value',
        value: {
          abilityToWorkOther: longStr,
          abilityToWork: ['OTHER'],
        },
      },
      message: 'Reason must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.abilityToWork = ['LIMITED_BY_OFFENSE']
    req.body.abilityToWorkOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.abilityToWork = ['OTHER']
    req.body.abilityToWorkOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
