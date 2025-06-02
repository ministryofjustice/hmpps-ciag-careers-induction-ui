import expressMocks from '../testutils/expressMocks'
import middleware from './parseCheckBoxValue'

describe('validationSchema', () => {
  const { req, res, next } = expressMocks()

  const parseCheckBoxValue = middleware('test_field')

  it('On success - test_field is not an array - Changes field to be an array and calls next', async () => {
    req.body.test_field = 'test_value'

    parseCheckBoxValue(req, res, next)

    expect(req.body.test_field).toEqual(['test_value'])
    expect(next).toHaveBeenCalledWith()
  })

  it('On success - test_field is an array - Does not change field and calls next', async () => {
    req.body.test_field = ['test_value']

    parseCheckBoxValue(req, res, next)

    expect(req.body.test_field).toEqual(['test_value'])
    expect(next).toHaveBeenCalledWith()
  })

  it('On success - test_field is undefined - Does not change field and calls next', async () => {
    req.body.test_field = undefined

    parseCheckBoxValue(req, res, next)

    expect(req.body.test_field).toEqual(undefined)
    expect(next).toHaveBeenCalledWith()
  })
})
