/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderCiagPlanArrays, orderCheckboxValue, orderObjectValue } from './orderCiagPlanArrays' // Update the import path

describe('orderCiagPlanArrays', () => {
  it('should correctly order CiagPlan arrays and objects', () => {
    // Create a sample CiagPlan object for testing
    const ciagPlan = {
      abilityToWork: ['A', 'C', 'OTHER', 'B'],
      reasonToNotGetWork: [],
      workExperience: {
        typeOfWorkExperience: ['OTHER', 'X', 'Y', 'Z'],
        workExperience: [],
      },
    } as any

    const result = orderCiagPlanArrays(ciagPlan)

    expect(result.abilityToWork).toEqual(['A', 'B', 'C', 'OTHER'])
    expect(result.reasonToNotGetWork).toEqual([])
    expect(result.workExperience.typeOfWorkExperience).toEqual(['X', 'Y', 'Z', 'OTHER'])
    expect(result.workExperience.workExperience).toEqual([])
  })

  it('should handle null arrays', () => {
    const ciagPlan = {
      abilityToWork: null,
      reasonToNotGetWork: undefined,
      workExperience: {
        typeOfWorkExperience: null,
        workExperience: undefined,
      },
    } as any

    const result = orderCiagPlanArrays(ciagPlan)

    expect(result.abilityToWork).toBe(null)
    expect(result.reasonToNotGetWork).toBe(undefined)
    expect(result.workExperience.typeOfWorkExperience).toBe(null)
    expect(result.workExperience.workExperience).toBe(undefined)
  })
})

describe('orderCheckboxValue', () => {
  it('should correctly order checkbox values', () => {
    const values = ['C', 'A', 'OTHER', 'B']
    const result = orderCheckboxValue(values)

    expect(result).toEqual(['A', 'B', 'C', 'OTHER'])
  })

  it('should handle empty arrays', () => {
    const values: string[] = []
    const result = orderCheckboxValue(values)

    expect(result).toEqual([])
  })
})

describe('orderObjectValue', () => {
  it('should correctly order objects by a specified key', () => {
    const values = [{ workInterest: 'X' }, { workInterest: 'OTHER' }, { workInterest: 'Z' }, { workInterest: 'Y' }]

    const result = orderObjectValue(values, 'workInterest')

    expect(result).toEqual([
      { workInterest: 'X' },
      { workInterest: 'Y' },
      { workInterest: 'Z' },
      { workInterest: 'OTHER' },
    ])
  })

  it('should handle empty arrays', () => {
    const values: Record<string, unknown>[] = []
    const result = orderObjectValue(values, 'workInterest')

    expect(result).toEqual([])
  })
})
