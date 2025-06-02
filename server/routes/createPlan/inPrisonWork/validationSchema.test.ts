import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
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
      message: 'Select the type of work mock_firstName mock_lastName would like to do in prison',
      path: ['inPrisonWork'],
      type: 'any.required',
      context: {
        key: 'inPrisonWork',
        label: 'inPrisonWork',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.inPrisonWork = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'inPrisonWork[0]',
        valids: [
          InPrisonWorkValue.CLEANING_AND_HYGIENE,
          InPrisonWorkValue.COMPUTERS_OR_DESK_BASED,
          InPrisonWorkValue.GARDENING_AND_OUTDOORS,
          InPrisonWorkValue.KITCHENS_AND_COOKING,
          InPrisonWorkValue.MAINTENANCE,
          InPrisonWorkValue.PRISON_LAUNDRY,
          InPrisonWorkValue.PRISON_LIBRARY,
          InPrisonWorkValue.TEXTILES_AND_SEWING,
          InPrisonWorkValue.WELDING_AND_METALWORK,
          InPrisonWorkValue.WOODWORK_AND_JOINERY,
          InPrisonWorkValue.OTHER,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of work mock_firstName mock_lastName would like to do in prison',
      path: ['inPrisonWork', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.inPrisonWork = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'inPrisonWorkOther',
        label: 'value',
        value: {
          inPrisonWork: ['OTHER'],
        },
      },
      message: 'Enter the type of work mock_firstName mock_lastName would like to do in prison',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.inPrisonWork = ['OTHER']
    req.body.inPrisonWorkOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'inPrisonWorkOther',
        label: 'value',
        value: {
          inPrisonWorkOther: longStr,
          inPrisonWork: ['OTHER'],
        },
      },
      message: 'Type of work experience must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.inPrisonWork = ['PRISON_LAUNDRY']
    req.body.inPrisonWorkOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.inPrisonWork = ['OTHER']
    req.body.inPrisonWorkOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
