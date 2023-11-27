import isBlank from './isBlank'
import properCaseName from './properCaseName'

export default function convertToTitleCase(sentence: string): string {
  return isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')
}
