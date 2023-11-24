import parseISODate from './parseISODate'
import formatDateToyyyyMMdd from './formatDateToyyyyMMdd'

/**
 * Return a date that is a number of weeks away from today.
 * With Date.now() you get the actual unix timestamp as milliseconds and then you add as many milliseconds
 * as you want to add days to.
 * One day is 24h60min60s*1000ms = 86400000 ms or 864E5.
 */

export default function offenderEarliestReleaseDate(weeks: number): string {
  const oneWeek = 7 * 86400000
  const d = new Date(Date.now() + weeks * oneWeek)
  const newDate = parseISODate(d.toISOString())
  return formatDateToyyyyMMdd(newDate.toString())
}
