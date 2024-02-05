import type { PreviousWorkExperienceDto } from 'dto'
import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
import previousWorkExperienceDtoComparator from './previousWorkExperienceDtoComparator'

describe('previousWorkExperienceDtoComparator', () => {
  it('should determine if 2 previous work experiences have equal experience types', () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      role: 'Builder',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      role: 'Builders mate',
    }

    // When
    const actual = previousWorkExperienceDtoComparator(previousWorkExperience1, previousWorkExperience2)

    // Then
    expect(actual).toEqual(0)
  })

  it(`should determine if a previous work experience's experience type is alphabetically before another instance's experience type`, () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      role: 'Builder',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.RETAIL,
      role: 'Shop assistant',
    }

    // When
    const actual = previousWorkExperienceDtoComparator(previousWorkExperience1, previousWorkExperience2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a previous work experience's experience type is alphabetically after another instance's experience type`, () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.RETAIL,
      role: 'Shop assistant',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      role: 'Builder',
    }

    // When
    const actual = previousWorkExperienceDtoComparator(previousWorkExperience1, previousWorkExperience2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given previous work experience with experience type 'OTHER' and another instance's experience type is alphabetically before 'OTHER'`, () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.OTHER,
      role: 'Dental technician',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      role: 'Builder',
    }

    // When
    const actual = previousWorkExperienceDtoComparator(previousWorkExperience1, previousWorkExperience2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given previous work experience with experience type 'OTHER' and another instance's experience type is alphabetically after 'OTHER'`, () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.OTHER,
      role: 'Dental technician',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.WAREHOUSING,
      role: 'Forklift driver',
    }

    // When
    const actual = previousWorkExperienceDtoComparator(previousWorkExperience1, previousWorkExperience2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return -1 given previous work experience with experience type alphabetically before 'OTHER' and another instance's experience type is 'OTHER'`, () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      role: 'Builder',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.OTHER,
      role: 'Dental technician',
    }

    // When
    const actual = previousWorkExperienceDtoComparator(previousWorkExperience1, previousWorkExperience2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should return -1 given previous work experience with experience type alphabetically after 'OTHER' and another instance's experience type is 'OTHER'`, () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.WAREHOUSING,
      role: 'Forklift driver',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.OTHER,
      role: 'Dental technician',
    }

    // When
    const actual = previousWorkExperienceDtoComparator(previousWorkExperience1, previousWorkExperience2)

    // Then
    expect(actual).toEqual(-1)
  })

  it('should sort an array of previous work experiences alphabetically on experience type, but with OTHER at the end', () => {
    // Given
    const previousWorkExperience1: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.RETAIL,
      role: 'Shop assistant',
    }
    const previousWorkExperience2: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.CONSTRUCTION,
      role: 'Builder',
    }
    const previousWorkExperience3: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.OTHER,
      role: 'Dental technician',
    }
    const previousWorkExperience4: PreviousWorkExperienceDto = {
      experienceType: TypeOfWorkExperienceValue.WAREHOUSING,
      role: 'Forklift driver',
    }

    const previousWorkExperiences = [
      previousWorkExperience1,
      previousWorkExperience2,
      previousWorkExperience3,
      previousWorkExperience4,
    ]

    const expected = [
      previousWorkExperience2,
      previousWorkExperience1,
      previousWorkExperience4,
      previousWorkExperience3,
    ] // alphabetically on type, with OTHER at the end

    // When
    previousWorkExperiences.sort(previousWorkExperienceDtoComparator)

    // Then
    expect(previousWorkExperiences).toEqual(expected)
  })
})
