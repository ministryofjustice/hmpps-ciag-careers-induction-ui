const arrayToQueryString = (array: (string | number | boolean)[], key: string): string => {
  if (!Array.isArray(array)) {
    return ''
  }

  return array && array.map(item => `${key}=${encodeURIComponent(item)}`).join('&')
}

export default arrayToQueryString
