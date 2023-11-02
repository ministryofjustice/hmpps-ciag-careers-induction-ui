import exp from 'constants'
import expressMocks from '../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const mockData = {
    prisoner: {
      searchTerm: '',
    },
  }
  const longStr = 'x'.repeat(201)
  const schema = validationSchema()

  it('On validation success - should allow a searchTerm with 200 characters', () => {
    req.body.searchTerm = 'x'.repeat(200)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a searchTerm longer than 200 characters', () => {
    req.body.searchTerm = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Search term must be 200 characters or less')
  })
})
