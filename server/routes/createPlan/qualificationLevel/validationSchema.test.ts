import QualificationLevelValue from '../../../enums/qualificationLevelValue'
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

  const schema = validationSchema(mockData)

  it('On validation error - Required - Returns the correct error message', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select the level of qualification mock_firstName mock_lastName wants to add',
      path: ['qualificationLevel'],
      type: 'any.required',
      context: {
        key: 'qualificationLevel',
        label: 'qualificationLevel',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.qualificationLevel = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'qualificationLevel',
        label: 'qualificationLevel',
        valids: [
          QualificationLevelValue.ENTRY_LEVEL,
          QualificationLevelValue.LEVEL_1,
          QualificationLevelValue.LEVEL_2,
          QualificationLevelValue.LEVEL_3,
          QualificationLevelValue.LEVEL_4,
          QualificationLevelValue.LEVEL_5,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the level of qualification mock_firstName mock_lastName wants to add',
      path: ['qualificationLevel'],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.qualificationLevel = 'ENTRY_LEVEL'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
