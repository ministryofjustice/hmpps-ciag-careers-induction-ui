import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonSearchService'
import PaginationService from './paginationServices'
import CuriousEsweService from './curiousEsweService'
import KeyworkerService from './keyworkerService'
import PrisonService from './prisonService'
import WhereaboutsService from './whereaboutsService'
import AllocationManagerService from './allocationManagerService'
import CommunityService from './communityService'
import CiagService from './ciagService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import ComponentService from './componentService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const paginationService = new PaginationService()
  const curiousEsweService = new CuriousEsweService(hmppsAuthClient)
  const keyworkerService = new KeyworkerService(hmppsAuthClient)
  const prisonService = new PrisonService(hmppsAuthClient)
  const whereaboutsService = new WhereaboutsService(hmppsAuthClient)
  const allocationManagerService = new AllocationManagerService(hmppsAuthClient)
  const communityService = new CommunityService(hmppsAuthClient)
  const ciagService = new CiagService()
  const educationAndWorkPlanService = new EducationAndWorkPlanService()
  const componentService = new ComponentService()

  return {
    userService,
    prisonerSearchService,
    paginationService,
    curiousEsweService,
    keyworkerService,
    prisonService,
    whereaboutsService,
    allocationManagerService,
    communityService,
    ciagService,
    educationAndWorkPlanService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
