export default interface PagedResponse<T> {
  content: T[]
  pageable: {
    sort?: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    pageNumber: number
    pageSize?: number
    page?: boolean
    unpaged?: boolean
  }
  last?: boolean
  totalElements: number
  totalPages: number
  first?: boolean
  size?: number
  number?: number
  sort?: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  numberOfElements: number
  empty?: boolean
}
