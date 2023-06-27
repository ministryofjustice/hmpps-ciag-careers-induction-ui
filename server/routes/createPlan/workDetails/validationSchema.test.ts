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
  const veryLongStr = 'x'.repeat(4001)

  const schema = validationSchema(mockData)

  beforeEach(() => {
    req.body = {}
  })

  it('On validation error - Required - Returns the correct error message', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'jobRole',
        label: 'jobRole',
      },
      message: 'Enter the job role mock_firstName mock_lastName wants to add',
      path: ['jobRole'],
      type: 'any.required',
    })
    expect(error.details[1]).toEqual({
      context: {
        key: 'jobDetails',
        label: 'jobDetails',
      },
      message: 'Enter details of what mock_firstName mock_lastName did in their job',
      path: ['jobDetails'],
      type: 'any.required',
    })
  })

  it('On validation error - Required role only - Returns the correct error message', () => {
    req.body.jobDetails = 'mock_role'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'jobRole',
        label: 'jobRole',
      },
      message: 'Enter the job role mock_firstName mock_lastName wants to add',
      path: ['jobRole'],
      type: 'any.required',
    })
  })

  it('On validation error - Required details only - Returns the correct error message', () => {
    req.body.jobRole = 'mock_role'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'jobDetails',
        label: 'jobDetails',
      },
      message: 'Enter details of what mock_firstName mock_lastName did in their job',
      path: ['jobDetails'],
      type: 'any.required',
    })
  })

  it('On validation error - Max role - Returns the correct error message', () => {
    req.body.jobRole = longStr
    req.body.jobDetails = 'mock_role'
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        encoding: undefined,
        key: 'jobRole',
        label: 'jobRole',
        limit: 200,
        value: longStr,
      },
      message: 'Job role must be 200 characters or less',
      path: ['jobRole'],
      type: 'string.max',
    })
  })

  it('On validation error - Max job details - Returns the correct error message', () => {
    req.body.jobRole = 'mock_role'
    req.body.jobDetails = veryLongStr
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        encoding: undefined,
        key: 'jobDetails',
        label: 'jobDetails',
        limit: 4000,
        value: veryLongStr,
      },
      message: 'Main tasks and responsibilities must be 4000 characters or less',
      path: ['jobDetails'],
      type: 'string.max',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.jobRole = 'mock_role'
    req.body.jobDetails = 'mock_details'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
