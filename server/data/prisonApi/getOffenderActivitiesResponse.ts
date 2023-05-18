interface Activity {
  bookingId: number
  agencyLocationId: string
  agencyLocationDescription: string
  description: string
  startDate: string
  endDate: string
  isCurrentActivity: boolean
}

interface Pageable {
  offset?: number
  pageNumber?: number
  pageSize?: number
  paged?: boolean
  sort?: Sort
  unpaged?: boolean
}

interface Sort {
  empty?: boolean
  sorted?: boolean
  unsorted?: boolean
}

export default interface GetOffenderActivitiesResponse {
  content: Array<Activity>
  pageable: Pageable
  empty?: boolean
  first?: boolean
  last?: boolean
  number?: number
  numberOfElements?: number
  size?: number
  totalElements?: number
  totalPages?: number
}
