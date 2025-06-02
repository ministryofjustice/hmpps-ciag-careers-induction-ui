/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse, parseISO } from 'date-fns'

const slashSeparatedDatePattern = /^\d{2}\/\d{2}\/\d{4}$/

/**
 * Parses a date in either ISO format (e.g. 2020-01-30T01:01:01.123Z)
 * or as a slash separated date (e.g. 30/01/2020) assuming UTC to avoid
 * dates drifting when parsing a BST date.
 * @param val date to be parsed.
 * @returns parsed date.
 */
export default function parseUTCDate(val: string): Date {
  if (RegExp(slashSeparatedDatePattern).test(val)) return parse(`${val} Z`, 'dd/MM/yyyy X', new Date())
  return val ? parseISO(val) : undefined
}
