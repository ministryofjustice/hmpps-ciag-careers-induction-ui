import { stubFor } from './wiremock'
import neurodiversityData from '../mockData/neurodiversityData'

const getLearnerNeurodivergence = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerNeurodivergence/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: neurodiversityData,
    },
  })

const getLearnerProfiles = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerEducation/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const getLearnerEducation = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/latestLearnerAssessments/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const getLearnerEducationRaw = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/latestLearnerAssessments/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const getLearnerEmployabilitySkills = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerEmployabilitySkills/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

export default {
  getLearnerNeurodivergence,
  getLearnerProfiles,
  getLearnerEducation,
  getLearnerEducationRaw,
  getLearnerEmployabilitySkills,
}
