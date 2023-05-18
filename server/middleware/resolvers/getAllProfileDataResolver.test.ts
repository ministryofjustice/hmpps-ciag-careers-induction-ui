/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getAllProfileDataResolver'
import getComById from './utils/getComById'
import getCurrentOffenderActivities from './utils/getCurrentOffenderActivities'
import getEmployabilitySkills from './utils/getEmployabilitySkills'
import getKeyworkerById from './utils/getKeyworkerById'
import getLatestAssessment from './utils/getLatestAssessment'
import getLearnerEducation from './utils/getLearnerEducation'
import getNeurodivergence from './utils/getNeurodivergence'
import getPomById from './utils/getPomById'
import getUnacceptableAbsenceCount from './utils/getUnacceptableAbsenceCount'

jest.mock('./utils/getComById', () => ({
  ...jest.requireActual('./utils/getComById'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getCurrentOffenderActivities', () => ({
  ...jest.requireActual('./utils/getCurrentOffenderActivities'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getEmployabilitySkills', () => ({
  ...jest.requireActual('./utils/getEmployabilitySkills'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getKeyworkerById', () => ({
  ...jest.requireActual('./utils/getKeyworkerById'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getLatestAssessment', () => ({
  ...jest.requireActual('./utils/getLatestAssessment'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getLearnerEducation', () => ({
  ...jest.requireActual('./utils/getLearnerEducation'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getNeurodivergence', () => ({
  ...jest.requireActual('./utils/getNeurodivergence'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getPomById', () => ({
  ...jest.requireActual('./utils/getPomById'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./utils/getUnacceptableAbsenceCount', () => ({
  ...jest.requireActual('./utils/getUnacceptableAbsenceCount'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getComByIdResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const servicesMock = {
    prisonerSearchService: {
      getPrisonerById: jest.fn(),
    },
  }
  const error = new Error('mock_error')

  const getComByIdMock = getComById as jest.Mock
  const getCurrentOffenderActivitiesMock = getCurrentOffenderActivities as jest.Mock
  const getEmployabilitySkillsMock = getEmployabilitySkills as jest.Mock
  const getKeyworkerByIdMock = getKeyworkerById as jest.Mock
  const getLatestAssessmentMock = getLatestAssessment as jest.Mock
  const getLearnerEducationMock = getLearnerEducation as jest.Mock
  const getNeurodivergenceMock = getNeurodivergence as jest.Mock
  const getPomByIdMock = getPomById as jest.Mock
  const getUnacceptableAbsenceCountMock = getUnacceptableAbsenceCount as jest.Mock

  const resolver = middleware(servicesMock as any)

  getComByIdMock.mockResolvedValue('com')
  getCurrentOffenderActivitiesMock.mockResolvedValue('currentOffenderActivities')
  getEmployabilitySkillsMock.mockResolvedValue('employabilitySkills')
  getKeyworkerByIdMock.mockResolvedValue('keyworker')
  getLatestAssessmentMock.mockResolvedValue('learnerLatestAssessment')
  getLearnerEducationMock.mockResolvedValue('learnerEducation')
  getNeurodivergenceMock.mockResolvedValue('neurodivergence')
  getPomByIdMock.mockResolvedValue('pom')
  getUnacceptableAbsenceCountMock.mockResolvedValue('unacceptableAbsenceCount')

  it('On error - Calls next with error', async () => {
    servicesMock.prisonerSearchService.getPrisonerById.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    servicesMock.prisonerSearchService.getPrisonerById.mockResolvedValue('prisoner')

    await resolver(req, res, next)

    expect(req.context.prisoner).toEqual('prisoner')
    expect(req.context.currentOffenderActivities).toEqual('currentOffenderActivities')
    expect(req.context.employabilitySkills).toEqual('employabilitySkills')
    expect(req.context.learnerEducation).toEqual('learnerEducation')
    expect(req.context.learnerLatestAssessment).toEqual('learnerLatestAssessment')
    expect(req.context.neurodivergence).toEqual('neurodivergence')
    expect(req.context.unacceptableAbsenceCount).toEqual('unacceptableAbsenceCount')
    expect(req.context.pom).toEqual('pom')
    expect(req.context.com).toEqual('com')
    expect(req.context.keyworker).toEqual('keyworker')

    expect(next).toHaveBeenCalledWith()
  })
})
