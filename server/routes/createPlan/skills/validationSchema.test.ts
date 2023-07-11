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
      message: 'Select the type of training or vocational qualification mock_firstName mock_lastName has',
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
          SkillsValue.CSCS,
          SkillsValue.DRIVING_LICENSE,
          SkillsValue.FIRST_AID,
          SkillsValue.FOOD_HYGIENE,
          SkillsValue.HEALTH_AND_SAFETY,
          SkillsValue.HGV_LICENSE,
          SkillsValue.MACHINERY,
          SkillsValue.MANUAL,
          SkillsValue.TRADE,
          SkillsValue.OTHER,
          SkillsValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of training or vocational qualification mock_firstName mock_lastName has',
      path: ['skills', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.skills = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'skillsDetails',
        label: 'value',
        value: {
          skills: ['OTHER'],
        },
      },
      message: 'Enter the type of training or vocational qualification mock_firstName mock_lastName has',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.skills = ['OTHER']
    req.body.skillsDetails = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'skillsDetails',
        label: 'value',
        value: {
          skillsDetails: longStr,
          skills: ['OTHER'],
        },
      },
      message: 'Other qualification must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.skills = ['MACHINERY']
    req.body.skillsDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.skills = ['OTHER']
    req.body.skillsDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
