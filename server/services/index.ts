import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonSearchService'
import CuriousEsweService from './curiousEsweService'
import ComponentService from './componentService'
import InductionService from './inductionService'

export const services = () => {
  const { hmppsAuthClient, educationAndWorkPlanClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const curiousEsweService = new CuriousEsweService(hmppsAuthClient)
  const inductionService = new InductionService(educationAndWorkPlanClient)
  const componentService = new ComponentService()

  return {
    userService,
    prisonerSearchService,
    curiousEsweService,
    inductionService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PrisonerSearchService, CuriousEsweService, InductionService, ComponentService }
