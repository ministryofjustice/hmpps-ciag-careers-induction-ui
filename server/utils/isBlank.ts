export default function isBlank(str: string): boolean {
  return !str || /^\s*$/.test(str)
}
