import { stubFor } from './wiremock'

import plans from '../mockData/ciagPlanData'

const getCiagPlan = (id = 'G6115VJ') => stubFor(plans[id])

export default {
  getCiagPlan,
}
