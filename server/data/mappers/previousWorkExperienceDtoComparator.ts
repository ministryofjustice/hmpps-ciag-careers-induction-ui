import type { PreviousWorkExperienceDto } from 'dto'
import enumComparator from './enumComparator'

/**
 * Comparator function that compares two `PreviousWorkExperienceDto` DTO instances, returning -1, 0 or 1 depending on whether the
 * first experience's experienceType property is alphabetically before, equal or after the second experience's experienceType property.
 * If the first job's type is 'OTHER' then 1 is returned.
 *
 * This comparator function can be used to sort an array of `PreviousWorkExperienceDto` DTO instances, resulting in the array being sorted
 * alphabetically on the `experienceType` property, except 'OTHER' which will always be at the end of the array.
 */
const previousWorkExperienceDtoComparator = (
  left: PreviousWorkExperienceDto,
  right: PreviousWorkExperienceDto,
): -1 | 0 | 1 => {
  return enumComparator(left.experienceType, right.experienceType)
}

export default previousWorkExperienceDtoComparator
