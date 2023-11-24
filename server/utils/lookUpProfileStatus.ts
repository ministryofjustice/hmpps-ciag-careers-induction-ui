export default function lookUpProfileStatus(status: { replaceAll: (arg0: string, arg1: string) => unknown }) {
  return status.replaceAll('_', ' ')
}
