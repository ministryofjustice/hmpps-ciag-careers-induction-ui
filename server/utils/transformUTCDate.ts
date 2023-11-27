import { TransformFnParams } from 'class-transformer'
import parseUTCDate from './parseUTCDate'

export default function transformUTCDate(params: TransformFnParams): Date {
  return parseUTCDate(params.value)
}
