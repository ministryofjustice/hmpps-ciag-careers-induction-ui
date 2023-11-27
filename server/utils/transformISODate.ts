import { TransformFnParams } from 'class-transformer'
import parseISODate from './parseISODate'

export default function transformISODate(params: TransformFnParams): Date {
  return parseISODate(params.value)
}
