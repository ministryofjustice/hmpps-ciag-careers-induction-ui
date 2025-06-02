import SkillsValue from '../../../enums/skillsValue'
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
      message: "Select the skill that mock_firstName mock_lastName feels they have or select 'None of these'",
      path: ['skills'],
      type: 'any.required',
      context: {
        key: 'skills',
        label: 'skills',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.skills = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'skills[0]',
        valids: [
          SkillsValue.COMMUNICATION,
          SkillsValue.POSITIVE_ATTITUDE,
          SkillsValue.RESILIENCE,
          SkillsValue.SELF_MANAGEMENT,
          SkillsValue.TEAMWORK,
          SkillsValue.THINKING_AND_PROBLEM_SOLVING,
          SkillsValue.WILLINGNESS_TO_LEARN,
          SkillsValue.OTHER,
          SkillsValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: "Select the skill that mock_firstName mock_lastName feels they have or select 'None of these'",
      path: ['skills', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.skills = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'skillsOther',
        label: 'value',
        value: {
          skills: ['OTHER'],
        },
      },
      message: 'Enter the skill that mock_firstName mock_lastName feels they have',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.skills = ['OTHER']
    req.body.skillsOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'skillsOther',
        label: 'value',
        value: {
          skillsOther: longStr,
          skills: ['OTHER'],
        },
      },
      message: 'Skill must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.skills = ['COMMUNICATION']
    req.body.skillsOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.skills = ['OTHER']
    req.body.skillsOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
