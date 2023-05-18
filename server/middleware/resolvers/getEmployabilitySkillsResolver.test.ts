/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getEmployabilitySkillsResolver'
import getEmployabilitySkills from './utils/getEmployabilitySkills'

jest.mock('./utils/getEmployabilitySkills', () => ({
  ...jest.requireActual('./utils/getEmployabilitySkills'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getEmployabilitySkillsResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    prn: req.params.id,
    establishmentId: 'MDI',
    establishmentName: 'MOORLAND (HMP & YOI)',
    employabilitySkill: 'Problem Solving',
    activityLocation: 'DPS',
    reviews: [
      {
        reviewDate: '2022-01-04',
        currentProgression: '4 - Good demonstration - Substantial evidence provided',
        comment: 'mock_comment',
      },
    ],
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getEmployabilitySkillsMock = getEmployabilitySkills as jest.Mock

  it('On error - Calls next with error', async () => {
    getEmployabilitySkillsMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getEmployabilitySkillsMock.mockResolvedValue(mockData.reviews)

    await resolver(req, res, next)

    expect(req.context.employabilitySkills).toEqual([
      {
        reviewDate: '2022-01-04',
        currentProgression: '4 - Good demonstration - Substantial evidence provided',
        comment: 'mock_comment',
      },
    ])

    expect(next).toHaveBeenCalledWith()
  })
})
