export default interface GetPomForOffenderResponse {
  primary_pom: {
    staff_id: number
    name: string
  }

  secondary_pom: {
    staff_id: number
    name: string
  }
}
