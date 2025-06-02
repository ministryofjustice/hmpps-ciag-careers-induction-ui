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
    qualificationLevel: QualificationLevelValue.LEVEL_1,
  }

  const longStr = 'x'.repeat(201)

  const schema = validationSchema(mockData)

  beforeEach(() => {
    req.body = {}
  })

  it('On validation error - Required - Returns the correct error message', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'qualificationSubject',
        label: 'qualificationSubject',
      },
      message: "Enter the subject of mock_firstName mock_lastName's level 1 qualification",
      path: ['qualificationSubject'],
      type: 'any.required',
    })
    expect(error.details[1]).toEqual({
      context: {
        key: 'qualificationGrade',
        label: 'qualificationGrade',
      },
      message: "Enter the grade of mock_firstName mock_lastName's level 1 qualification",
      path: ['qualificationGrade'],
      type: 'any.required',
    })
  })

  it('On validation error - Required subject only - Returns the correct error message', () => {
    req.body.qualificationGrade = 'mock_grade'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'qualificationSubject',
        label: 'qualificationSubject',
      },
      message: "Enter the subject of mock_firstName mock_lastName's level 1 qualification",
      path: ['qualificationSubject'],
      type: 'any.required',
    })
  })

  it('On validation error - Required grade only - Returns the correct error message', () => {
    req.body.qualificationSubject = 'mock_subject'
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'qualificationGrade',
        label: 'qualificationGrade',
      },
      message: "Enter the grade of mock_firstName mock_lastName's level 1 qualification",
      path: ['qualificationGrade'],
      type: 'any.required',
    })
  })

  it('On validation error - Max subject - Returns the correct error message', () => {
    req.body.qualificationSubject = longStr
    req.body.qualificationGrade = 'mock_grade'
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        encoding: undefined,
        key: 'qualificationSubject',
        label: 'qualificationSubject',
        limit: 200,
        value: longStr,
      },
      message: 'Subject must be 200 characters or less',
      path: ['qualificationSubject'],
      type: 'string.max',
    })
  })

  it('On validation error - Max grade - Returns the correct error message', () => {
    req.body.qualificationSubject = 'mock_subject'
    req.body.qualificationGrade = longStr
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        encoding: undefined,
        key: 'qualificationGrade',
        label: 'qualificationGrade',
        limit: 200,
        value: longStr,
      },
      message: 'Grade must be 200 characters or less',
      path: ['qualificationGrade'],
      type: 'string.max',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.qualificationSubject = 'mock_subject'
    req.body.qualificationGrade = 'mock_grade'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
