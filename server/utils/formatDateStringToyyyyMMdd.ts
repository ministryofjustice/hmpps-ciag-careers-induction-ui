import { TransformFnParams } from 'class-transformer'

export default function formatDateStringToyyyyMMdd(params: TransformFnParams) {
  try {
    const d = new Date(params.value)

    if (Number.isNaN(d.getMonth()) || params.value === null) {
      return 'N/A'
    }

    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`

    return [day, month, year].join('-')
  } catch {
    return 'N/A'
  }
}
