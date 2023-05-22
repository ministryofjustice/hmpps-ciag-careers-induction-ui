import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
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
      message: 'Select whether mock_firstName mock_lastName is hoping to get work',
      path: ['hopingToGetWork'],
      type: 'any.required',
      context: {
        key: 'hopingToGetWork',
        label: 'hopingToGetWork',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.hopingToGetWork = 'RUBBISH'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select whether mock_firstName mock_lastName is hoping to get work',
      path: ['hopingToGetWork'],
      type: 'any.only',
      context: {
        key: 'hopingToGetWork',
        label: 'hopingToGetWork',
        valids: [HopingToGetWorkValue.YES, HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE],
        value: 'RUBBISH',
      },
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.hopingToGetWork = HopingToGetWorkValue.YES

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
