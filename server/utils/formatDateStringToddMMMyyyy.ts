import { format } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

export default function formatDateStringToddMMMyyyy(params: TransformFnParams) {
  try {
    if (!params.value) return 'N/A'
    const date = new Date(params.value)

    return format(date, 'dd MMM yyyy')
  } catch {
    return 'N/A'
  }
}
