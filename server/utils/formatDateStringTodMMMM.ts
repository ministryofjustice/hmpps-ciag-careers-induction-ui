import { format } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

export default function formatDateStringTodMMMM(params: TransformFnParams) {
  try {
    if (!params.value) return 'N/A'
    const date = new Date(params.value)

    return format(date, 'd MMMM')
  } catch {
    return 'N/A'
  }
}
