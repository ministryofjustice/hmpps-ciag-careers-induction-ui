import type { FutureWorkInterestDto } from 'dto'
import WorkInterestsValue from '../../enums/workInterestsValue'
import futureWorkInterestDtoComparator from './futureWorkInterestDtoComparator'

describe('futureWorkInterestDtoComparator', () => {
  it('should determine if 2 future work interests have equal work types', () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.CONSTRUCTION,
      role: 'Builder',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.CONSTRUCTION,
      role: 'Builders mate',
    }

    // When
    const actual = futureWorkInterestDtoComparator(futureWorkInterest1, futureWorkInterest2)

    // Then
    expect(actual).toEqual(0)
  })

  it(`should determine if a future work interest's work type is alphabetically before another instance's work type`, () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.CONSTRUCTION,
      role: 'Builder',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.RETAIL,
      role: 'Shop assistant',
    }

    // When
    const actual = futureWorkInterestDtoComparator(futureWorkInterest1, futureWorkInterest2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should determine if a future work interest's work type is alphabetically after another instance's work type`, () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.RETAIL,
      role: 'Shop assistant',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.CONSTRUCTION,
      role: 'Builder',
    }

    // When
    const actual = futureWorkInterestDtoComparator(futureWorkInterest1, futureWorkInterest2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given future work interest with work type 'OTHER' and another instance's work type is alphabetically before 'OTHER'`, () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.OTHER,
      role: 'Dental technician',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.CONSTRUCTION,
      role: 'Builder',
    }

    // When
    const actual = futureWorkInterestDtoComparator(futureWorkInterest1, futureWorkInterest2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return 1 given future work interest with work type 'OTHER' and another instance's work type is alphabetically after 'OTHER'`, () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.OTHER,
      role: 'Dental technician',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.WAREHOUSING,
      role: 'Forklift driver',
    }

    // When
    const actual = futureWorkInterestDtoComparator(futureWorkInterest1, futureWorkInterest2)

    // Then
    expect(actual).toEqual(1)
  })

  it(`should return -1 given future work interest with work type alphabetically before 'OTHER' and another instance's work type is 'OTHER'`, () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.CONSTRUCTION,
      role: 'Builder',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.OTHER,
      role: 'Dental technician',
    }

    // When
    const actual = futureWorkInterestDtoComparator(futureWorkInterest1, futureWorkInterest2)

    // Then
    expect(actual).toEqual(-1)
  })

  it(`should return -1 given future work interest with work type alphabetically after 'OTHER' and another instance's work type is 'OTHER'`, () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.WAREHOUSING,
      role: 'Forklift driver',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.OTHER,
      role: 'Dental technician',
    }

    // When
    const actual = futureWorkInterestDtoComparator(futureWorkInterest1, futureWorkInterest2)

    // Then
    expect(actual).toEqual(-1)
  })

  it('should sort an array of future work interests alphabetically on work type, but with OTHER at the end', () => {
    // Given
    const futureWorkInterest1: FutureWorkInterestDto = {
      workType: WorkInterestsValue.RETAIL,
      role: 'Shop assistant',
    }
    const futureWorkInterest2: FutureWorkInterestDto = {
      workType: WorkInterestsValue.CONSTRUCTION,
      role: 'Builder',
    }
    const futureWorkInterest3: FutureWorkInterestDto = {
      workType: WorkInterestsValue.OTHER,
      role: 'Dental technician',
    }
    const futureWorkInterest4: FutureWorkInterestDto = {
      workType: WorkInterestsValue.WAREHOUSING,
      role: 'Forklift driver',
    }

    const futureWorkInterests = [futureWorkInterest1, futureWorkInterest2, futureWorkInterest3, futureWorkInterest4]

    const expected = [futureWorkInterest2, futureWorkInterest1, futureWorkInterest4, futureWorkInterest3] // alphabetically on type, with OTHER at the end

    // When
    futureWorkInterests.sort(futureWorkInterestDtoComparator)

    // Then
    expect(futureWorkInterests).toEqual(expected)
  })
})
