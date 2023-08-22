import InPrisonEducationValue from '../../../enums/inPrisonEducationValue'
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
      message: 'Select the type of training mock_firstName mock_lastName would like to do in prison',
      path: ['inPrisonEducation'],
      type: 'any.required',
      context: {
        key: 'inPrisonEducation',
        label: 'inPrisonEducation',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.inPrisonEducation = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'inPrisonEducation[0]',
        valids: [
          InPrisonEducationValue.BARBERING_AND_HAIRDRESSING,
          InPrisonEducationValue.CATERING,
          InPrisonEducationValue.COMMUNICATION_SKILLS,
          InPrisonEducationValue.ENGLISH_LANGUAGE_SKILLS,
          InPrisonEducationValue.FORKLIFT_DRIVING,
          InPrisonEducationValue.INTERVIEW_SKILLS,
          InPrisonEducationValue.MACHINERY_TICKETS,
          InPrisonEducationValue.NUMERACY_SKILLS,
          InPrisonEducationValue.RUNNING_A_BUSINESS,
          InPrisonEducationValue.SOCIAL_AND_LIFE_SKILLS,
          InPrisonEducationValue.WELDING_AND_METALWORK,
          InPrisonEducationValue.WOODWORK_AND_JOINERY,
          InPrisonEducationValue.OTHER,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the type of training mock_firstName mock_lastName would like to do in prison',
      path: ['inPrisonEducation', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.inPrisonEducation = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'inPrisonEducationOther',
        label: 'value',
        value: {
          inPrisonEducation: ['OTHER'],
        },
      },
      message: 'Enter the type of type of training mock_firstName mock_lastName would like to do in prison',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.inPrisonEducation = ['OTHER']
    req.body.inPrisonEducationOther = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'inPrisonEducationOther',
        label: 'value',
        value: {
          inPrisonEducationOther: longStr,
          inPrisonEducation: ['OTHER'],
        },
      },
      message: 'Training in prison must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.inPrisonEducation = ['WELDING_AND_METALWORK']
    req.body.inPrisonEducationOther = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.inPrisonEducation = ['OTHER']
    req.body.inPrisonEducationOther = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
