import { format } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

export default function formatDateStringToddMMMyyyyHHmm(params: TransformFnParams) {
  if (!params.value) return 'N/A'
  const date = new Date(params.value)

  return format(date, 'dd MMM yyyy HH:mm')
}
