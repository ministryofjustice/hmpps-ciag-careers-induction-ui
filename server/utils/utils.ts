/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse, parseISO, format } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

function properCase(word: string): string {
  return word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
}

function isBlank(str: string): boolean {
  return !str || /^\s*$/.test(str)
}

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
function properCaseName(name: string): string {
  return isBlank(name) ? '' : name.split('-').map(properCase).join('-')
}

export function convertToTitleCase(sentence: string): string {
  return isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')
}

const slashSeparatedDatePattern = /^\d{2}\/\d{2}\/\d{4}$/

/**
 * Parses a date in either ISO format (e.g. 2020-01-30T01:01:01.123Z)
 * or as a slash separated date (e.g. 30/01/2020) assuming UTC to avoid
 * dates drifting when parsing a BST date.
 * @param val date to be parsed.
 * @returns parsed date.
 */
export function parseUTCDate(val: string): Date {
  if (RegExp(slashSeparatedDatePattern).test(val)) return parse(`${val} Z`, 'dd/MM/yyyy X', new Date())
  return val ? parseISO(val) : undefined
}
export function parseISODate(val: string): Date {
  if (RegExp(slashSeparatedDatePattern).test(val)) return parse(`${val} Z`, 'yyyy-MM-dd', new Date())
  return val ? parseISO(val) : undefined
}

export function transformUTCDate(params: TransformFnParams): Date {
  return parseUTCDate(params.value)
}
export function transformISODate(params: TransformFnParams): Date {
  return parseISODate(params.value)
}

/**
 * Return a date that is a number of weeks away from today.
 * With Date.now() you get the actual unix timestamp as milliseconds and then you add as many milliseconds
 * as you want to add days to.
 * One day is 24h60min60s*1000ms = 86400000 ms or 864E5.
 */
export function offenderEarliestReleaseDate(weeks: number): string {
  const oneWeek = 7 * 86400000
  const d = new Date(Date.now() + weeks * oneWeek)
  const newDate = parseISODate(d.toISOString())
  return formatDateToyyyyMMdd(newDate.toString())
}

export function formatShortDate(val: Date): string {
  return val.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  })
}
export function formatDateToyyyyMMdd(params: string): string {
  const d = new Date(params)
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = `0${month}`
  if (day.length < 2) day = `0${day}`

  return [year, month, day].join('-')
}
export function formatDateStringToyyyyMMdd(params: TransformFnParams) {
  if (!params.value) return 'N/A'

  const d = new Date(params.value)
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = `0${month}`
  if (day.length < 2) day = `0${day}`

  return [day, month, year].join('-')
}

export function formatDateStringToddMMMyyyy(params: TransformFnParams) {
  if (!params.value) return 'N/A'
  const date = new Date(params.value)

  return format(date, 'dd MMM yyyy')
}

export function formatDateStringToddMMMyyyyHHmm(params: TransformFnParams) {
  if (!params.value) return 'N/A'
  const date = new Date(params.value)

  return format(date, 'dd MMM yyyy HH:mm')
}

export function formatDateStringToddMMMyyyyHHmmAsArray(params: TransformFnParams) {
  if (!params.value) return ['N/A']
  const date = new Date(params.value)

  return [format(date, 'dd MMM yyyy'), format(date, 'HH:mm')]
}

export function formatDateStringTodMMMM(params: TransformFnParams) {
  if (!params.value) return 'N/A'
  const date = new Date(params.value)

  return format(date, 'd MMMM')
}

export function lookUpProfileStatus(status: any) {
  return status.replaceAll('_', ' ')
}

export function getAge(dateString: string) {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

export const arrayToQueryString = (array: string[] | number[] | boolean[], key: string): string =>
  array && array.map(item => `${key}=${encodeURIComponent(item)}`).join('&')

export const mapToQueryString = (params: Record<never, never>): string =>
  Object.keys(params)
    .filter(key => params[key])
    .map(key => {
      if (Array.isArray(params[key])) return arrayToQueryString(params[key], key)
      return `${key}=${encodeURIComponent(params[key])}`
    })
    .join('&')
