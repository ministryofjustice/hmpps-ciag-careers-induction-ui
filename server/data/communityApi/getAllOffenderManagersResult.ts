export default interface OffenderManagersResult {
  staffCode: string
  staffId: number
  isResponsibleOfficer: boolean
  isPrisonOffenderManager: boolean
  isUnallocated: boolean
  staff: {
    forenames: string
    surname: string
  }
  team: {
    code: string
    description: string
    localDeliveryUnit: {
      code: string
      description: string
    }
    teamType: {
      code: string
      description: string
    }
    district: {
      code: string
      description: string
    }
    borough: {
      code: string
      description: string
    }
    startDate: string
  }
  probationArea: {
    probationAreaId: number
    code: string
    description: string
    organisation: {
      code: string
      description: string
    }
    teams: {
      teamId: number
      code: string
      description: string
      isPrivate: boolean
      scProvider: {
        code: string
        description: string
      }
      localDeliveryUnit: {
        code: string
        description: string
      }
      district: {
        code: string
        description: string
      }
      borough: {
        code: string
        description: string
      }
    }[]
  }
  fromDate: string
  grade: {
    code: string
    description: string
  }
}
