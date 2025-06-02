interface LookupObject {
  [key: string]: string
}

// Searches a lookup object for a for the first key contained in the search string and returns its value.
export default function findValue(searchString: string, lookup: LookupObject): string | undefined {
  const foundKey = Object.keys(lookup).find(key => {
    if (searchString.includes(key)) {
      return true // return true to break out of the loop when a match is found
    }
    return false // return false to indicate that no match has been found yet
  })
  return foundKey ? lookup[foundKey] : undefined
}
