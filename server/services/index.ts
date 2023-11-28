import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonSearchService'
import PaginationService from './paginationServices'
import CuriousEsweService from './curiousEsweService'
import PrisonService from './prisonService'
import CiagService from './ciagService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import ComponentService from './componentService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const paginationService = new PaginationService()
  const curiousEsweService = new CuriousEsweService(hmppsAuthClient)
  const prisonService = new PrisonService(hmppsAuthClient)
  const ciagService = new CiagService()
  const educationAndWorkPlanService = new EducationAndWorkPlanService()
  const componentService = new ComponentService()

  return {
    userService,
    prisonerSearchService,
    paginationService,
    curiousEsweService,
    prisonService,
    ciagService,
    educationAndWorkPlanService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
