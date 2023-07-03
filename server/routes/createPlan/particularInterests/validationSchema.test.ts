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

  const veryLongStr = 'x'.repeat(4001)

  const schema = validationSchema(mockData)

  beforeEach(() => {
    req.body = {}
  })

  it('On validation error - Required - Returns the correct error message', () => {
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
