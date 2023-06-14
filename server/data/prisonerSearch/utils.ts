/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import { WorkReadinessProfileStatus } from '../domain/types/profileStatus'
import CiagViewModel from '../../viewModels/ciagViewModel'
import PrisonerViewModel from '../../viewModels/ciagListViewModel'
import config from '../../config'

const maxPerPage = config.paginationPageSize

export default function getActionsRequired(offenderProfile: any) {
  const status = offenderProfile?.profileData.status

  switch (status) {
    case WorkReadinessProfileStatus.READY_TO_WORK:
      return {
        workTypeInterests: offenderProfile.profileData.supportAccepted.workInterests.workTypesOfInterest,
      }
    case WorkReadinessProfileStatus.SUPPORT_NEEDED: {
      const supportNeeded = offenderProfile.profileData.supportAccepted.actionsRequired.actions.filter(
        (x: any) => x.status !== 'COMPLETED',
      )
      return { supportNeeded: supportNeeded.map((x: { todoItem: any }) => x.todoItem) }
    }
    case WorkReadinessProfileStatus.NO_RIGHT_TO_WORK:
      return {
        noRightToWork: 'Does not have the right to work in the UK',
      }
    case WorkReadinessProfileStatus.NOT_STARTED:
      return status
    case WorkReadinessProfileStatus.SUPPORT_DECLINED: {
      const supportDeclined = offenderProfile.profileData.supportDeclined.supportToWorkDeclinedReason.map((x: any) => x)
      return {
        supportDeclinedReasons: supportDeclined,
      }
    }
    default:
      return 'N/A'
  }
}

export function getPaginatedCiagList(ciagList: PrisonerViewModel[], page: number) {
  const contents = ciagList.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / maxPerPage)
    const updatedResultArray = [...resultArray] // Create a new array instead of modifying resultArray directly

    if (!updatedResultArray[chunkIndex]) {
      updatedResultArray[chunkIndex] = []
    }
    updatedResultArray[chunkIndex].push(item)
    return updatedResultArray
  }, [])

  const pageMetaData = {
    pageable: {
      sort: { empty: true, sorted: false, unsorted: true },
      offset: maxPerPage * page,
      pageSize: maxPerPage,
      pageNumber: page,
      paged: true,
      unpaged: false,
    },
    totalElements: contents.length ? ciagList.length : 0,
    last: page === (contents.length ? contents.length - 1 : 0),
    totalPages: contents ? contents.length - 1 : 0,
    size: maxPerPage,
    number: 0,
    sort: { empty: true, sorted: false, unsorted: true },
    first: page === 0,
    numberOfElements: contents.length ? contents[page]?.length ?? 0 : 0,
    empty: ciagList.length === 0,
  }

  return {
    ...pageMetaData,
    content: contents[page]?.map((result: any) =>
      plainToClass(CiagViewModel, result, { excludeExtraneousValues: true }),
    ),
  }
}

// Sort dataset, given criteria
export function sortOffenderProfile(
  profiles: PrisonerViewModel[],
  sortBy: string,
  orderBy: string,
): PrisonerViewModel[] {
  const sortedProfiles = [...profiles]

  sortedProfiles.sort((a, b) => {
    if (sortBy === 'lastName') {
      if (a.lastName > b.lastName) return orderBy === 'ascending' ? 1 : -1
      if (b.lastName > a.lastName) return orderBy === 'ascending' ? -1 : 1
    }
    if (sortBy === 'releaseDate') {
      if (a.releaseDate > b.releaseDate) return orderBy === 'ascending' ? 1 : -1
      if (b.releaseDate > a.releaseDate) return orderBy === 'ascending' ? -1 : 1
    }
    if (sortBy === 'receptionDate') {
      if (new Date(a.receptionDate) > new Date(b.receptionDate)) return orderBy === 'ascending' ? 1 : -1
      if (new Date(b.receptionDate) > new Date(a.receptionDate)) return orderBy === 'ascending' ? -1 : 1
    }
    return 0 // Add a default return value for cases where sortBy doesn't match any condition
  })

  return sortedProfiles
}
