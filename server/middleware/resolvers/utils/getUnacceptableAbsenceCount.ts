import WhereaboutsService from '../../../services/whereaboutsService'

const getUnacceptibleAbsenceCount = async (whereaboutsService: WhereaboutsService, username: string, id: string) => {
  const fromDate = new Date()
  fromDate.setMonth(fromDate.getMonth() - 6)
  const toDate = new Date()

  return whereaboutsService.getUnacceptibleAbsenceCount(username, id, fromDate, toDate)
}

export default getUnacceptibleAbsenceCount
