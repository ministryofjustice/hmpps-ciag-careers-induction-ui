import type { FutureWorkInterestDto } from 'dto'
import enumComparator from './enumComparator'

/**
 * Comparator function that compares two `FutureWorkInterestDto` DTO instances, returning -1, 0 or 1 depending on whether the
 * first interest's  workType property is alphabetically before, equal or after the second interest's workType property.
 * If the first interest's workType is 'OTHER' then 1 is returned.
 *
 * This comparator function can be used to sort an array of `FutureWorkInterestDto` DTO instances, resulting in the array being sorted
 * alphabetically on the `workType` property, except 'OTHER' which will always be at the end of the array.
 */
const futureWorkInterestDtoComparator = (left: FutureWorkInterestDto, right: FutureWorkInterestDto): -1 | 0 | 1 => {
  return enumComparator(left.workType, right.workType)
}

export default futureWorkInterestDtoComparator
