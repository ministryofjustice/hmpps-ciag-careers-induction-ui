import WorkInterestsValue from '../../../enums/workInterestsValue'
import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const mockData = {
    workInterests: [WorkInterestsValue.BEAUTY, WorkInterestsValue.CONSTRUCTION, WorkInterestsValue.OTHER],
    workInterestsOther: 'Some random job',
  }

  const longStr = 'x'.repeat(201)

  const schema = validationSchema(mockData)

  beforeEach(() => {
    req.body = {}
  })

  it('On validation error - Max length - Returns the correct error message', () => {
    req.body[WorkInterestsValue.BEAUTY] = longStr
    req.body[WorkInterestsValue.CONSTRUCTION] = longStr
    req.body[WorkInterestsValue.OTHER] = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        encoding: undefined,
        key: WorkInterestsValue.BEAUTY,
        label: WorkInterestsValue.BEAUTY,
        limit: 200,
        value: longStr,
      },
      message: 'Hair, beauty and wellbeing job role must be 200 characters or less',
      path: [WorkInterestsValue.BEAUTY],
      type: 'string.max',
    })
    expect(error.details[1]).toEqual({
      context: {
        encoding: undefined,
        key: WorkInterestsValue.CONSTRUCTION,
        label: WorkInterestsValue.CONSTRUCTION,
        limit: 200,
        value: longStr,
      },
      message: 'Construction and trade job role must be 200 characters or less',
      path: [WorkInterestsValue.CONSTRUCTION],
      type: 'string.max',
    })
    expect(error.details[2]).toEqual({
      context: {
        encoding: undefined,
        key: WorkInterestsValue.OTHER,
        label: WorkInterestsValue.OTHER,
        limit: 200,
        value: longStr,
      },
      message: 'Some random job job role must be 200 characters or less',
      path: [WorkInterestsValue.OTHER],
      type: 'string.max',
    })
  })

  it('On validation success - Optional - Returns no errors', () => {
    req.body[WorkInterestsValue.BEAUTY] = ''
    req.body[WorkInterestsValue.CONSTRUCTION] = ''
    req.body[WorkInterestsValue.OTHER] = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - Valid values - Returns no errors', () => {
    req.body[WorkInterestsValue.BEAUTY] = 'Some value'
    req.body[WorkInterestsValue.CONSTRUCTION] = 'Some value'
    req.body[WorkInterestsValue.OTHER] = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
