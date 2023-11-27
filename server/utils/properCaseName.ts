import isBlank from './isBlank'
import properCase from './properCase'

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */

export default function properCaseName(name: string): string {
  return isBlank(name) ? '' : name.split('-').map(properCase).join('-')
}
