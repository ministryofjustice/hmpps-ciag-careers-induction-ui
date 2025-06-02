/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse, parseISO } from 'date-fns'

const slashSeparatedDatePattern = /^\d{2}\/\d{2}\/\d{4}$/

export default function parseISODate(val: string): Date {
  if (RegExp(slashSeparatedDatePattern).test(val)) return parse(`${val} Z`, 'yyyy-MM-dd', new Date())
  return val ? parseISO(val) : undefined
}
